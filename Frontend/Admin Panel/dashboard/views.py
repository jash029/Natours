from django.shortcuts import render, redirect
from django.contrib import messages
from accounts.rbac import permission_required
from api_client.client import APIError

@permission_required('view_dashboard')
def dashboard_index(request):
    try:
        data = request.api_client.get_dashboard()
        stats = data.get('stats', {})
        charts = data.get('charts', {})
        recent_bookings = data.get('recent_bookings', [])
        latest_customers = data.get('latest_customers', [])
        pending_verifications = data.get('pending_verifications_list', [])
        recent_activities = data.get('recent_activities', [])
    except APIError as e:
        messages.error(request, f"Dashboard API Error: {e.message}")
        stats, charts, recent_bookings, latest_customers, pending_verifications, recent_activities = {}, {}, [], [], [], []

    # Comprehensive Chart Datasets for Jinja Templates
    # 1. Junior Admin Charts (Consultant & Assistant Models)
    junior_charts = {
        'consultant_inquiry_categories': {
            'labels': ['Custom Itinerary', 'General Info', 'Group Discounts', 'Visa Assistance', 'Flight Booking', 'Special Requests'],
            'data': [342, 215, 189, 145, 98, 67]
        },
        'assistant_resolution_status': {
            'labels': ['Resolved', 'In Progress', 'Awaiting Customer', 'Escalated to Senior'],
            'data': [620, 140, 85, 35]
        },
        'consultant_response_time': {
            'labels': ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            'avg_response_mins': [14, 12, 18, 11, 15, 22, 28],
            'target_mins': [15, 15, 15, 15, 15, 15, 15]
        },
        'verification_status_donut': {
            'labels': ['Verified ID', 'Passport Pending', 'Proof of Deposit Needed', 'Rejected Docs'],
            'data': [450, 120, 65, 25]
        },
        'daily_assistance_volume': {
            'labels': ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'],
            'tickets': [35, 82, 124, 145, 110, 78, 42]
        }
    }

    # 2. Senior Admin Charts (Tour & Booking Models)
    senior_charts = {
        'top_destinations': [
            {'destination': 'Swiss Alps Alpine Expedition', 'bookings': 184, 'revenue': '$892,400'},
            {'destination': 'Italian Dolomites Circuit', 'bookings': 142, 'revenue': '$639,000'},
            {'destination': 'Patagonia Wilderness Trek', 'bookings': 118, 'revenue': '$554,600'},
            {'destination': 'Kyoto Autumn Cultural Journey', 'bookings': 96, 'revenue': '$432,000'},
            {'destination': 'Icelandic Northern Lights', 'bookings': 85, 'revenue': '$399,500'}
        ],
        'booking_status_distribution': {
            'Confirmed': 640,
            'Pending Payment': 145,
            'Cancelled': 48,
            'Completed': 410
        },
        'tour_theme_ratings': {
            'labels': ['Alpine & Peaks', 'Coastal & Islands', 'Cultural Heritage', 'Wildlife Safari', 'Glacier Expeditions', 'Luxury Wellness'],
            'ratings': [4.9, 4.7, 4.8, 4.95, 4.85, 4.6],
            'popularity_score': [92, 85, 78, 96, 88, 70]
        },
        'hotel_room_preferences': {
            'labels': ['Swiss Alps', 'Dolomites', 'Patagonia', 'Kyoto', 'Iceland'],
            'luxury_suite': [45, 30, 20, 35, 25],
            'deluxe_double': [85, 70, 55, 40, 42],
            'standard_twin': [40, 32, 35, 15, 14],
            'private_villa': [14, 10, 8, 6, 4]
        },
        'traveler_age_demographics': {
            'labels': ['18-25', '26-35', '36-45', '46-60', '60+'],
            'counts': [120, 410, 380, 260, 110]
        },
        'lead_time_vs_cancellation': [
            {'x': 14, 'y': 4.2, 'r': 12},  # 14 days lead time, 4.2% cancellation
            {'x': 30, 'y': 6.8, 'r': 18},
            {'x': 60, 'y': 11.5, 'r': 24},
            {'x': 90, 'y': 18.2, 'r': 30},
            {'x': 120, 'y': 24.5, 'r': 22}
        ]
    }

    # 3. Super Admin Charts (Revenue, ML Forecasting, Data Pipelines, Python Libraries)
    super_charts = {
        'revenue_trend': {
            'labels': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            'actual_revenue': [210000, 245000, 310000, 290000, 420000, 480000, 560000, 620000, 510000, 450000, 380000, 520000],
            'target_revenue': [200000, 230000, 280000, 300000, 390000, 450000, 520000, 580000, 480000, 420000, 360000, 490000]
        },
        'monthly_profit_margin': {
            'labels': ['Q1', 'Q2', 'Q3', 'Q4'],
            'gross_margin_pct': [28.5, 31.2, 34.8, 32.0],
            'net_profit_usd': [218000, 371000, 588000, 432000]
        },
        'country_distribution': [
            {'country': 'United States', 'percentage': 38.5},
            {'country': 'Germany', 'percentage': 22.0},
            {'country': 'United Kingdom', 'percentage': 16.5},
            {'country': 'France', 'percentage': 12.0},
            {'country': 'Japan & Aus', 'percentage': 11.0}
        ],
        'ml_demand_forecast': {
            'labels': ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan (FC)', 'Feb (FC)', 'Mar (FC)'],
            'historical': [560000, 620000, 510000, 450000, 380000, 520000, None, None, None],
            'forecast': [None, None, None, None, None, 520000, 575000, 610000, 690000],
            'upper_bound': [None, None, None, None, None, 520000, 605000, 645000, 735000],
            'lower_bound': [None, None, None, None, None, 520000, 545000, 575000, 645000]
        },
        'ml_feature_importance': {
            'labels': ['Booking Lead Time', 'Advance Deposit Ratio', 'Historical Cancellations', 'Tour Seasonality Index', 'Customer Lifetime Spend', 'Group Headcount'],
            'scores': [0.38, 0.24, 0.16, 0.11, 0.07, 0.04]
        },
        'data_cleaning_funnel': {
            'labels': ['Raw Ingestion Stream', 'Null & Type Sanitized', 'De-duplicated Records', 'Outlier & Anomaly Filtered', 'ML Vectorized Features'],
            'values': [50000, 48200, 46100, 44800, 44250]
        },
        'python_lib_benchmark': {
            'labels': ['Pandas ETL', 'NumPy Matrix', 'Scikit-Learn ML', 'Statsmodels ARIMA', 'SciPy Stats', 'Matplotlib / Seaborn'],
            'execution_speed_score': [94, 98, 88, 82, 90, 86]
        }
    }

    # Determine user role from request.user or fallback
    user_role = 'JUNIOR_ADMIN'
    if request.user.is_authenticated:
        if request.user.is_superuser:
            user_role = 'SUPER_ADMIN'
        elif hasattr(request.user, 'staff_profile'):
            user_role = request.user.staff_profile.role

    return render(request, 'dashboard/index.html', {
        'stats': stats,
        'charts': charts,
        'recent_bookings': recent_bookings,
        'latest_customers': latest_customers,
        'pending_verifications': pending_verifications,
        'recent_activities': recent_activities,
        'junior_charts': junior_charts,
        'senior_charts': senior_charts,
        'super_charts': super_charts,
        'user_role': user_role,
    })

