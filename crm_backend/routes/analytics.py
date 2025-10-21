from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.deal import Deal
from models.contact import Contact
from models.user import User
from datetime import datetime, date
from sqlalchemy import func

analytics_bp = Blueprint('analytics', __name__)

@analytics_bp.route('/dashboard', methods=['GET'])
@jwt_required()
def get_dashboard_analytics():
    """Get dashboard analytics"""
    try:
        user_id = get_jwt_identity()
        current_user = User.query.get(user_id)
        
        # Build base queries
        contact_query = Contact.query
        deal_query = Deal.query
        
        if current_user.role not in ['admin', 'manager']:
            contact_query = contact_query.filter(Contact.owner_id == user_id)
            deal_query = deal_query.filter(Deal.owner_id == user_id)
        
        # Contact statistics
        total_contacts = contact_query.count()
        contacts_by_status = {}
        for status in ['lead', 'prospect', 'customer', 'inactive', 'qualified', 'unqualified']:
            contacts_by_status[status] = contact_query.filter_by(status=status).count()
        
        # Deal statistics
        total_deals = deal_query.count()
        deals_by_stage = {}
        for stage in ['lead', 'qualification', 'proposal', 'negotiation', 'closed_won', 'closed_lost']:
            deals_by_stage[stage] = deal_query.filter_by(stage=stage).count()
        
        # Pipeline value
        active_deals = deal_query.filter_by(status='active').all()
        pipeline_value = sum(deal.get_weighted_value() for deal in active_deals)
        
        # Won deals value
        won_deals = deal_query.filter_by(stage='closed_won').all()
        won_value = sum(float(deal.actual_value) for deal in won_deals if deal.actual_value)
        
        # Recent activities
        recent_activities = Activity.query.filter_by(user_id=user_id).order_by(
            Activity.created_at.desc()
        ).limit(10).all()
        
        return jsonify({
            'contacts': {
                'total': total_contacts,
                'by_status': contacts_by_status
            },
            'deals': {
                'total': total_deals,
                'by_stage': deals_by_stage,
                'pipeline_value': pipeline_value,
                'won_value': won_value
            },
            'recent_activities': [activity.to_dict() for activity in recent_activities]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@analytics_bp.route('/sales-performance', methods=['GET'])
@jwt_required()
def get_sales_performance():
    """Get sales performance analytics"""
    try:
        user_id = get_jwt_identity()
        current_user = User.query.get(user_id)
        
        # Get date range
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        
        # Build query
        query = Deal.query.filter(Deal.stage == 'closed_won')
        
        if current_user.role not in ['admin', 'manager']:
            query = query.filter(Deal.owner_id == user_id)
        
        if start_date:
            query = query.filter(Deal.actual_close_date >= datetime.strptime(start_date, '%Y-%m-%d').date())
        
        if end_date:
            query = query.filter(Deal.actual_close_date <= datetime.strptime(end_date, '%Y-%m-%d').date())
        
        # Get performance data
        deals = query.all()
        
        # Calculate metrics
        total_revenue = sum(float(deal.actual_value) for deal in deals if deal.actual_value)
        avg_deal_size = total_revenue / len(deals) if deals else 0
        total_deals = len(deals)
        
        # Monthly performance
        monthly_data = {}
        for deal in deals:
            if deal.actual_close_date:
                month_key = deal.actual_close_date.strftime('%Y-%m')
                if month_key not in monthly_data:
                    monthly_data[month_key] = {'deals': 0, 'revenue': 0}
                monthly_data[month_key]['deals'] += 1
                monthly_data[month_key]['revenue'] += float(deal.actual_value) if deal.actual_value else 0
        
        return jsonify({
            'total_revenue': total_revenue,
            'avg_deal_size': avg_deal_size,
            'total_deals': total_deals,
            'monthly_performance': monthly_data
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@analytics_bp.route('/pipeline-analysis', methods=['GET'])
@jwt_required()
def get_pipeline_analysis():
    """Get pipeline analysis"""
    try:
        user_id = get_jwt_identity()
        current_user = User.query.get(user_id)
        
        # Build query
        query = Deal.query.filter_by(status='active')
        
        if current_user.role not in ['admin', 'manager']:
            query = query.filter(Deal.owner_id == user_id)
        
        deals = query.all()
        
        # Pipeline analysis
        pipeline_data = {}
        for stage in ['lead', 'qualification', 'proposal', 'negotiation']:
            stage_deals = [deal for deal in deals if deal.stage == stage]
            pipeline_data[stage] = {
                'count': len(stage_deals),
                'total_value': sum(deal.estimated_value for deal in stage_deals),
                'weighted_value': sum(deal.get_weighted_value() for deal in stage_deals)
            }
        
        # Conversion rates
        conversion_rates = {}
        stages = ['lead', 'qualification', 'proposal', 'negotiation', 'closed_won']
        for i in range(len(stages) - 1):
            current_stage = stages[i]
            next_stage = stages[i + 1]
            
            current_count = pipeline_data.get(current_stage, {}).get('count', 0)
            next_count = pipeline_data.get(next_stage, {}).get('count', 0)
            
            conversion_rate = (next_count / current_count * 100) if current_count > 0 else 0
            conversion_rates[f'{current_stage}_to_{next_stage}'] = conversion_rate
        
        return jsonify({
            'pipeline_data': pipeline_data,
            'conversion_rates': conversion_rates
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@analytics_bp.route('/activities', methods=['GET'])
@jwt_required()
def get_activity_analytics():
    """Get activity analytics"""
    try:
        user_id = get_jwt_identity()
        current_user = User.query.get(user_id)
        
        # Get date range
        days = request.args.get('days', 30, type=int)
        start_date = datetime.utcnow() - datetime.timedelta(days=days)
        
        # Build query
        query = Activity.query.filter(Activity.created_at >= start_date)
        
        if current_user.role not in ['admin', 'manager']:
            query = query.filter(Activity.user_id == user_id)
        
        activities = query.all()
        
        # Activity counts by type
        activity_counts = {}
        for activity in activities:
            activity_type = activity.activity_type
            if activity_type not in activity_counts:
                activity_counts[activity_type] = 0
            activity_counts[activity_type] += 1
        
        # Daily activity
        daily_activity = {}
        for activity in activities:
            date_key = activity.created_at.strftime('%Y-%m-%d')
            if date_key not in daily_activity:
                daily_activity[date_key] = 0
            daily_activity[date_key] += 1
        
        return jsonify({
            'activity_counts': activity_counts,
            'daily_activity': daily_activity,
            'total_activities': len(activities)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
