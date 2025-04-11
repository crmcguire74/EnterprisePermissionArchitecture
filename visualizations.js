import * as d3 from 'd3';

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all visualizations
    initArchitectureDiagram();
    initLicenseWorkflow();
    initLicenseMetricsChart();
    initArchitectureVisualization();
    initRolePermissionVisualization();
    initOnboardingVisualization();
});

// Architecture Diagram in Architecture Section
function initArchitectureDiagram() {
    const container = document.getElementById('architecture-diagram');
    if (!container) return;
    
    // Set dimensions
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    // Create SVG
    const svg = d3.select(container)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', [0, 0, width, height])
        .attr('style', 'font: 12px sans-serif');
    
    // Create zoom behavior
    const zoom = d3.zoom()
        .scaleExtent([0.5, 3])
        .on('zoom', (event) => {
            g.attr('transform', event.transform);
        });
    
    svg.call(zoom);
    
    // Create main group for zoom transforms
    const g = svg.append('g');
    
    // Architecture diagram data
    const nodes = [
        { id: 'business_functions', label: 'Business Functions', type: 'function', x: width / 2, y: 80 },
        { id: 'roles', label: 'Roles', type: 'role', x: width / 2, y: 160 },
        { id: 'permission_sets', label: 'Permission Sets', type: 'permission', x: width / 2, y: 240 },
        { id: 'applications', label: 'Applications', type: 'application', x: width / 2 - 120, y: 320 },
        { id: 'data_resources', label: 'Data Resources', type: 'data', x: width / 2 + 120, y: 320 }
    ];
    
    const links = [
        { source: 'business_functions', target: 'roles' },
        { source: 'roles', target: 'permission_sets' },
        { source: 'permission_sets', target: 'applications' },
        { source: 'permission_sets', target: 'data_resources' }
    ];
    
    // Color scale for node types
    const colorScale = d3.scaleOrdinal()
        .domain(['function', 'role', 'permission', 'application', 'data'])
        .range(['#3A86FF', '#8338EC', '#FF006E', '#FB5607', '#FFBE0B']);
    
    // Draw links
    g.selectAll('.link')
        .data(links)
        .join('line')
        .attr('class', 'link')
        .attr('x1', d => nodes.find(n => n.id === d.source).x)
        .attr('y1', d => nodes.find(n => n.id === d.source).y)
        .attr('x2', d => nodes.find(n => n.id === d.target).x)
        .attr('y2', d => nodes.find(n => n.id === d.target).y)
        .attr('stroke', '#999')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '5,5');
    
    // Draw node groups
    const nodeGroups = g.selectAll('.node')
        .data(nodes)
        .join('g')
        .attr('class', 'node')
        .attr('transform', d => `translate(${d.x}, ${d.y})`);
    
    // Draw node rectangles
    nodeGroups.append('rect')
        .attr('x', -100)
        .attr('y', -25)
        .attr('width', 200)
        .attr('height', 50)
        .attr('rx', 8)
        .attr('fill', d => colorScale(d.type))
        .attr('stroke', '#fff')
        .attr('stroke-width', 2);
    
    // Add node labels
    nodeGroups.append('text')
        .attr('dy', 5)
        .attr('text-anchor', 'middle')
        .attr('fill', 'white')
        .style('font-weight', 'bold')
        .text(d => d.label);
    
    // Add descriptions for each node
    const descriptions = [
        'Top-level organizational units',
        'Standardized job functions',
        'Groups of specific permissions',
        'Software applications access',
        'Database and file system access'
    ];
    
    nodeGroups.append('text')
        .attr('dy', 25)
        .attr('text-anchor', 'middle')
        .attr('fill', 'white')
        .attr('font-size', 10)
        .text((d, i) => descriptions[i]);
    
    // Handle zoom controls from main.js
    window.addEventListener('diagram-zoom-in', () => {
        svg.transition().duration(300).call(zoom.scaleBy, 1.2);
    });
    
    window.addEventListener('diagram-zoom-out', () => {
        svg.transition().duration(300).call(zoom.scaleBy, 0.8);
    });
    
    window.addEventListener('diagram-reset-view', () => {
        svg.transition().duration(300).call(zoom.transform, d3.zoomIdentity);
    });
}

// License Workflow Diagram
function initLicenseWorkflow() {
    const container = document.getElementById('license-workflow-diagram');
    if (!container) return;
    
    // Set dimensions
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    // Create SVG
    const svg = d3.select(container)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', [0, 0, width, height]);
    
    // Workflow steps
    const steps = [
        { id: 'role_assignment', label: 'Role Assignment', x: width * 0.2, y: height * 0.2 },
        { id: 'license_requirement', label: 'License Requirement Detection', x: width * 0.5, y: height * 0.2 },
        { id: 'license_check', label: 'License Availability Check', x: width * 0.8, y: height * 0.2 },
        { id: 'license_assignment', label: 'License Assignment', x: width * 0.8, y: height * 0.5 },
        { id: 'app_provisioning', label: 'Application Provisioning', x: width * 0.5, y: height * 0.5 },
        { id: 'user_notification', label: 'User Notification', x: width * 0.2, y: height * 0.5 },
        { id: 'license_monitoring', label: 'Usage Monitoring', x: width * 0.5, y: height * 0.8 }
    ];
    
    const flows = [
        { source: 'role_assignment', target: 'license_requirement' },
        { source: 'license_requirement', target: 'license_check' },
        { source: 'license_check', target: 'license_assignment' },
        { source: 'license_assignment', target: 'app_provisioning' },
        { source: 'app_provisioning', target: 'user_notification' },
        { source: 'user_notification', target: 'license_monitoring' },
        { source: 'license_monitoring', target: 'license_check', dashed: true }
    ];
    
    // Define arrow marker
    svg.append('defs').append('marker')
        .attr('id', 'arrowhead')
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 8)
        .attr('refY', 0)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M0,-5L10,0L0,5')
        .attr('fill', '#666');
    
    // Draw flows
    svg.selectAll('.flow')
        .data(flows)
        .join('path')
        .attr('class', 'flow')
        .attr('d', d => {
            const source = steps.find(s => s.id === d.source);
            const target = steps.find(s => s.id === d.target);
            
            // Create curved paths
            const midX = (source.x + target.x) / 2;
            const midY = (source.y + target.y) / 2 + (d.dashed ? 30 : 0);
            
            return `M${source.x},${source.y} Q${midX},${midY} ${target.x},${target.y}`;
        })
        .attr('fill', 'none')
        .attr('stroke', '#666')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', d => d.dashed ? '5,5' : '0')
        .attr('marker-end', 'url(#arrowhead)');
    
    // Draw step nodes
    const stepNodes = svg.selectAll('.step')
        .data(steps)
        .join('g')
        .attr('class', 'step')
        .attr('transform', d => `translate(${d.x}, ${d.y})`);
    
    stepNodes.append('circle')
        .attr('r', 40)
        .attr('fill', '#3A86FF')
        .attr('opacity', 0.9)
        .attr('stroke', 'white')
        .attr('stroke-width', 2);
    
    stepNodes.append('text')
        .attr('text-anchor', 'middle')
        .attr('fill', 'white')
        .attr('font-weight', 'bold')
        .attr('font-size', 11)
        .selectAll('tspan')
        .data(d => d.label.split(' '))
        .join('tspan')
        .attr('x', 0)
        .attr('dy', (d, i) => i === 0 ? -5 : 15)
        .text(d => d);
}

// License Metrics Chart
function initLicenseMetricsChart() {
    const container = document.getElementById('license-metrics-chart');
    if (!container || !window.Chart) return;
    
    // Create canvas element
    const canvas = document.createElement('canvas');
    container.appendChild(canvas);
    
    // Sample data
    const data = {
        labels: ['License Utilization', 'Cost Optimization', 'Provisioning Time', 'License Compliance'],
        datasets: [
            {
                label: 'Before Optimization',
                data: [60, 40, 30, 70],
                backgroundColor: 'rgba(220, 53, 69, 0.5)',
                borderColor: 'rgba(220, 53, 69, 1)',
                borderWidth: 1
            },
            {
                label: 'After Optimization',
                data: [85, 75, 80, 95],
                backgroundColor: 'rgba(25, 135, 84, 0.5)',
                borderColor: 'rgba(25, 135, 84, 1)',
                borderWidth: 1
            }
        ]
    };
    
    // Chart configuration
    const config = {
        type: 'radar',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        display: false
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    };
    
    // Create the chart
    new Chart(canvas, config);
}

// Main Architecture Visualization
function initArchitectureVisualization() {
    const container = document.getElementById('architecture-visualization');
    if (!container) return;
    
    // Set dimensions
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    // Create SVG
    const svg = d3.select(container)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', [0, 0, width, height]);
    
    // Create zoom behavior
    const zoom = d3.zoom()
        .scaleExtent([0.5, 3])
        .on('zoom', (event) => {
            g.attr('transform', event.transform);
        });
    
    svg.call(zoom);
    
    // Create main group for zoom transforms
    const g = svg.append('g');
    
    // Create the legend container
    const legendContainer = document.getElementById('visualization-legend-items');
    
    // Function to generate the visualization based on the selected view
    function generateVisualization(view) {
        // Clear previous visualization
        g.selectAll('*').remove();
        
        // Clear legend
        if (legendContainer) {
            legendContainer.innerHTML = '';
        }
        
        let nodes, links, nodeTypes, colorScale;
        
        // Define different visualizations based on the view
        if (view === 'overview') {
            // High-level overview of the architecture
            nodeTypes = ['business', 'role', 'permission', 'application', 'data', 'license'];
            colorScale = d3.scaleOrdinal()
                .domain(nodeTypes)
                .range(['#3A86FF', '#8338EC', '#FF006E', '#FB5607', '#FFBE0B', '#06D6A0']);
            
            nodes = [
                { id: 'entraID', label: 'Microsoft Entra ID', type: 'business', level: 0, x: width/2, y: 50 },
                { id: 'adminUnits', label: 'Administrative Units', type: 'business', level: 1, x: width/2, y: 130 },
                { id: 'biz1', label: 'Finance', type: 'business', level: 2, x: width*0.2, y: 210 },
                { id: 'biz2', label: 'Trading', type: 'business', level: 2, x: width*0.4, y: 210 },
                { id: 'biz3', label: 'Operations', type: 'business', level: 2, x: width*0.6, y: 210 },
                { id: 'biz4', label: 'IT', type: 'business', level: 2, x: width*0.8, y: 210 },
                
                { id: 'role1', label: 'Financial Analyst', type: 'role', level: 3, x: width*0.2, y: 290 },
                { id: 'role2', label: 'Trading Manager', type: 'role', level: 3, x: width*0.4, y: 290 },
                { id: 'role3', label: 'Operations Specialist', type: 'role', level: 3, x: width*0.6, y: 290 },
                { id: 'role4', label: 'IT Support', type: 'role', level: 3, x: width*0.8, y: 290 },
                
                { id: 'perm1', label: 'Financial Data Access', type: 'permission', level: 4, x: width*0.2, y: 370 },
                { id: 'perm2', label: 'Trading Systems', type: 'permission', level: 4, x: width*0.4, y: 370 },
                { id: 'perm3', label: 'Operations Tools', type: 'permission', level: 4, x: width*0.6, y: 370 },
                { id: 'perm4', label: 'IT Systems', type: 'permission', level: 4, x: width*0.8, y: 370 },
                
                { id: 'app1', label: 'Bloomberg', type: 'application', level: 5, x: width*0.3, y: 450 },
                { id: 'app2', label: 'Trading Platform', type: 'application', level: 5, x: width*0.5, y: 450 },
                { id: 'app3', label: 'Operations Portal', type: 'application', level: 5, x: width*0.7, y: 450 },
                
                { id: 'data1', label: 'Financial DB', type: 'data', level: 6, x: width*0.2, y: 530 },
                { id: 'data2', label: 'Trading DB', type: 'data', level: 6, x: width*0.4, y: 530 },
                { id: 'data3', label: 'Operations DB', type: 'data', level: 6, x: width*0.6, y: 530 },
                { id: 'data4', label: 'System Logs', type: 'data', level: 6, x: width*0.8, y: 530 },
                
                { id: 'license1', label: 'Bloomberg Licenses', type: 'license', level: 7, x: width*0.3, y: 610 },
                { id: 'license2', label: 'Trading Platform Licenses', type: 'license', level: 7, x: width*0.7, y: 610 }
            ];
            
            links = [
                { source: 'entraID', target: 'adminUnits' },
                { source: 'adminUnits', target: 'biz1' },
                { source: 'adminUnits', target: 'biz2' },
                { source: 'adminUnits', target: 'biz3' },
                { source: 'adminUnits', target: 'biz4' },
                
                { source: 'biz1', target: 'role1' },
                { source: 'biz2', target: 'role2' },
                { source: 'biz3', target: 'role3' },
                { source: 'biz4', target: 'role4' },
                
                { source: 'role1', target: 'perm1' },
                { source: 'role2', target: 'perm2' },
                { source: 'role3', target: 'perm3' },
                { source: 'role4', target: 'perm4' },
                
                { source: 'perm1', target: 'app1' },
                { source: 'perm2', target: 'app2' },
                { source: 'perm3', target: 'app3' },
                
                { source: 'app1', target: 'data1' },
                { source: 'app2', target: 'data2' },
                { source: 'app3', target: 'data3' },
                { source: 'app3', target: 'data4' },
                
                { source: 'app1', target: 'license1' },
                { source: 'app2', target: 'license2' }
            ];
        } else if (view === 'detailed') {
            // Detailed roles and permissions view
            // This would have more nodes showing specific permissions
            // For brevity, I'm creating a simpler version here
            nodeTypes = ['business', 'role', 'permission', 'app-permission', 'db-permission', 'file-permission'];
            colorScale = d3.scaleOrdinal()
                .domain(nodeTypes)
                .range(['#3A86FF', '#8338EC', '#FF006E', '#FB5607', '#FFBE0B', '#06D6A0']);
            
            // Detailed nodes would go here
            nodes = [
                // Business function
                { id: 'finance', label: 'Finance Department', type: 'business', x: width/2, y: 50 },
                
                // Roles
                { id: 'analyst', label: 'Financial Analyst', type: 'role', x: width*0.3, y: 150 },
                { id: 'manager', label: 'Finance Manager', type: 'role', x: width*0.7, y: 150 },
                
                // Permission sets
                { id: 'basic_finance', label: 'Basic Finance Permissions', type: 'permission', x: width*0.2, y: 250 },
                { id: 'advanced_finance', label: 'Advanced Finance Permissions', type: 'permission', x: width*0.5, y: 250 },
                { id: 'approval_perms', label: 'Approval Permissions', type: 'permission', x: width*0.8, y: 250 },
                
                // Application permissions
                { id: 'bloomberg_view', label: 'Bloomberg View', type: 'app-permission', x: width*0.1, y: 350 },
                { id: 'bloomberg_analyze', label: 'Bloomberg Analyze', type: 'app-permission', x: width*0.3, y: 350 },
                { id: 'erp_view', label: 'ERP View', type: 'app-permission', x: width*0.5, y: 350 },
                { id: 'erp_modify', label: 'ERP Modify', type: 'app-permission', x: width*0.7, y: 350 },
                { id: 'erp_approve', label: 'ERP Approve', type: 'app-permission', x: width*0.9, y: 350 },
                
                // Database permissions
                { id: 'finance_db_read', label: 'Finance DB Read', type: 'db-permission', x: width*0.2, y: 450 },
                { id: 'finance_db_write', label: 'Finance DB Write', type: 'db-permission', x: width*0.5, y: 450 },
                { id: 'finance_db_admin', label: 'Finance DB Admin', type: 'db-permission', x: width*0.8, y: 450 },
                
                // File permissions
                { id: 'reports_read', label: 'Reports Read', type: 'file-permission', x: width*0.3, y: 550 },
                { id: 'reports_write', label: 'Reports Write', type: 'file-permission', x: width*0.7, y: 550 }
            ];
            
            links = [
                // Business to role links
                { source: 'finance', target: 'analyst' },
                { source: 'finance', target: 'manager' },
                
                // Role to permission set links
                { source: 'analyst', target: 'basic_finance' },
                { source: 'manager', target: 'basic_finance' },
                { source: 'manager', target: 'advanced_finance' },
                { source: 'manager', target: 'approval_perms' },
                
                // Permission sets to application permissions
                { source: 'basic_finance', target: 'bloomberg_view' },
                { source: 'basic_finance', target: 'erp_view' },
                { source: 'advanced_finance', target: 'bloomberg_analyze' },
                { source: 'advanced_finance', target: 'erp_modify' },
                { source: 'approval_perms', target: 'erp_approve' },
                
                // Permission sets to database permissions
                { source: 'basic_finance', target: 'finance_db_read' },
                { source: 'advanced_finance', target: 'finance_db_write' },
                { source: 'approval_perms', target: 'finance_db_admin' },
                
                // Permission sets to file permissions
                { source: 'basic_finance', target: 'reports_read' },
                { source: 'advanced_finance', target: 'reports_write' }
            ];
        } else if (view === 'licensing') {
            // License-focused view
            nodeTypes = ['license-type', 'application', 'license-group', 'role', 'user'];
            colorScale = d3.scaleOrdinal()
                .domain(nodeTypes)
                .range(['#3A86FF', '#FB5607', '#FF006E', '#8338EC', '#06D6A0']);
            
            nodes = [
                // License types
                { id: 'named_user', label: 'Named User Licenses', type: 'license-type', x: width*0.25, y: 50 },
                { id: 'concurrent', label: 'Concurrent Use Licenses', type: 'license-type', x: width*0.75, y: 50 },
                
                // Applications
                { id: 'bloomberg', label: 'Bloomberg Terminal', type: 'application', x: width*0.15, y: 150 },
                { id: 'reuters', label: 'Reuters Eikon', type: 'application', x: width*0.35, y: 150 },
                { id: 'trading_platform', label: 'Trading Platform', type: 'application', x: width*0.65, y: 150 },
                { id: 'analysis_tool', label: 'Analysis Tool', type: 'application', x: width*0.85, y: 150 },
                
                // License groups
                { id: 'bloomberg_licenses', label: 'Bloomberg Licenses', type: 'license-group', x: width*0.15, y: 250 },
                { id: 'reuters_licenses', label: 'Reuters Licenses', type: 'license-group', x: width*0.35, y: 250 },
                { id: 'trading_licenses', label: 'Trading Licenses Pool', type: 'license-group', x: width*0.65, y: 250 },
                { id: 'analysis_licenses', label: 'Analysis Licenses Pool', type: 'license-group', x: width*0.85, y: 250 },
                
                // Roles
                { id: 'analyst_role', label: 'Financial Analyst', type: 'role', x: width*0.25, y: 350 },
                { id: 'trader_role', label: 'Trader', type: 'role', x: width*0.75, y: 350 },
                
                // Users
                { id: 'user1', label: 'John (Analyst)', type: 'user', x: width*0.15, y: 450 },
                { id: 'user2', label: 'Sarah (Analyst)', type: 'user', x: width*0.35, y: 450 },
                { id: 'user3', label: 'Michael (Trader)', type: 'user', x: width*0.65, y: 450 },
                { id: 'user4', label: 'Emily (Trader)', type: 'user', x: width*0.85, y: 450 }
            ];
            
            links = [
                // License types to applications
                { source: 'named_user', target: 'bloomberg' },
                { source: 'named_user', target: 'reuters' },
                { source: 'concurrent', target: 'trading_platform' },
                { source: 'concurrent', target: 'analysis_tool' },
                
                // Applications to license groups
                { source: 'bloomberg', target: 'bloomberg_licenses' },
                { source: 'reuters', target: 'reuters_licenses' },
                { source: 'trading_platform', target: 'trading_licenses' },
                { source: 'analysis_tool', target: 'analysis_licenses' },
                
                // License groups to roles
                { source: 'bloomberg_licenses', target: 'analyst_role', dashed: true },
                { source: 'reuters_licenses', target: 'analyst_role', dashed: true },
                { source: 'trading_licenses', target: 'trader_role', dashed: true },
                { source: 'analysis_licenses', target: 'trader_role', dashed: true },
                { source: 'analysis_licenses', target: 'analyst_role', dashed: true },
                
                // Roles to users
                { source: 'analyst_role', target: 'user1' },
                { source: 'analyst_role', target: 'user2' },
                { source: 'trader_role', target: 'user3' },
                { source: 'trader_role', target: 'user4' }
            ];
        } else {
            // Default to overview
            return generateVisualization('overview');
        }
        
        // Create legend items
        if (legendContainer) {
            nodeTypes.forEach(type => {
                const color = colorScale(type);
                const typeLabels = {
                    'business': 'Business Function',
                    'role': 'Role',
                    'permission': 'Permission Set',
                    'application': 'Application',
                    'data': 'Data Resource',
                    'license': 'License',
                    'app-permission': 'Application Permission',
                    'db-permission': 'Database Permission',
                    'file-permission': 'File System Permission',
                    'license-type': 'License Type',
                    'license-group': 'License Group',
                    'user': 'User'
                };
                
                const legendItem = document.createElement('div');
                legendItem.className = 'legend-item me-3 mb-2';
                legendItem.innerHTML = `
                    <span class="legend-color" style="background-color: ${color};"></span>
                    <span class="legend-label">${typeLabels[type] || type}</span>
                `;
                legendContainer.appendChild(legendItem);
            });
        }
        
        // Define arrow marker
        svg.select('defs').remove(); // Remove previous defs
        svg.append('defs').append('marker')
            .attr('id', 'arrowhead')
            .attr('viewBox', '0 -5 10 10')
            .attr('refX', 15)
            .attr('refY', 0)
            .attr('markerWidth', 6)
            .attr('markerHeight', 6)
            .attr('orient', 'auto')
            .append('path')
            .attr('d', 'M0,-5L10,0L0,5')
            .attr('fill', '#666');
        
        // Draw links
        g.selectAll('.link')
            .data(links)
            .join('path')
            .attr('class', 'link')
            .attr('d', d => {
                const source = nodes.find(n => n.id === d.source);
                const target = nodes.find(n => n.id === d.target);
                
                if (!source || !target) return '';
                
                // Create straight lines or gentle curves
                const dx = target.x - source.x;
                const dy = target.y - source.y;
                const dr = Math.sqrt(dx * dx + dy * dy) * 1.5;
                
                if (Math.abs(dx) < 10) {
                    // Direct vertical connection
                    return `M${source.x},${source.y} L${target.x},${target.y}`;
                } else {
                    // Curved path
                    return `M${source.x},${source.y} A${dr},${dr} 0 0,1 ${target.x},${target.y}`;
                }
            })
            .attr('fill', 'none')
            .attr('stroke', '#666')
            .attr('stroke-width', 1.5)
            .attr('stroke-dasharray', d => d.dashed ? '5,5' : '0')
            .attr('marker-end', 'url(#arrowhead)');
        
        // Draw nodes
        const nodeGroups = g.selectAll('.node')
            .data(nodes)
            .join('g')
            .attr('class', 'node')
            .attr('transform', d => `translate(${d.x}, ${d.y})`)
            .call(d3.drag()
                .on('start', dragstarted)
                .on('drag', dragged)
                .on('end', dragended));
        
        // Node shape based on type
        nodeGroups.each(function(d) {
            const node = d3.select(this);
            const nodeWidth = 120;
            const nodeHeight = 40;
            
            // Different shapes for different node types
            if (d.type === 'business' || d.type === 'license-type') {
                // Cloud-like shape for business functions
                node.append('ellipse')
                    .attr('rx', nodeWidth / 2)
                    .attr('ry', nodeHeight / 2)
                    .attr('fill', colorScale(d.type))
                    .attr('stroke', 'white')
                    .attr('stroke-width', 2);
            } else if (d.type === 'user') {
                // Circle for users
                node.append('circle')
                    .attr('r', 25)
                    .attr('fill', colorScale(d.type))
                    .attr('stroke', 'white')
                    .attr('stroke-width', 2);
            } else {
                // Rectangle for other types
                node.append('rect')
                    .attr('x', -nodeWidth / 2)
                    .attr('y', -nodeHeight / 2)
                    .attr('width', nodeWidth)
                    .attr('height', nodeHeight)
                    .attr('rx', 6)
                    .attr('fill', colorScale(d.type))
                    .attr('stroke', 'white')
                    .attr('stroke-width', 2);
            }
            
            // Add label
            node.append('text')
                .attr('text-anchor', 'middle')
                .attr('dy', 5)
                .attr('fill', 'white')
                .attr('font-weight', 'bold')
                .attr('font-size', 12)
                .text(d.label);
        });
        
        // Add tooltips
        nodeGroups.append('title')
            .text(d => d.label);
        
        // Drag functions
        function dragstarted(event, d) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }
        
        function dragged(event, d) {
            d.fx = event.x;
            d.fy = event.y;
        }
        
        function dragended(event, d) {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }
        
        // Set up force simulation
        const simulation = d3.forceSimulation(nodes)
            .force('link', d3.forceLink()
                .id(d => d.id)
                .links(links)
                .distance(100))
            .force('charge', d3.forceManyBody().strength(-300))
            .force('x', d3.forceX().x(d => d.x).strength(0.5))
            .force('y', d3.forceY().y(d => d.y).strength(0.5))
            .on('tick', () => {
                // Update link positions
                g.selectAll('.link')
                    .attr('d', d => {
                        const source = nodes.find(n => n.id === d.source.id || n.id === d.source);
                        const target = nodes.find(n => n.id === d.target.id || n.id === d.target);
                        
                        if (!source || !target) return '';
                        
                        const dx = target.x - source.x;
                        const dy = target.y - source.y;
                        const dr = Math.sqrt(dx * dx + dy * dy) * 1.5;
                        
                        if (Math.abs(dx) < 10) {
                            return `M${source.x},${source.y} L${target.x},${target.y}`;
                        } else {
                            return `M${source.x},${source.y} A${dr},${dr} 0 0,1 ${target.x},${target.y}`;
                        }
                    });
                
                // Update node positions
                g.selectAll('.node')
                    .attr('transform', d => `translate(${d.x}, ${d.y})`);
            });
        
        // Run simulation briefly then stop
        simulation.alpha(1).restart();
        setTimeout(() => simulation.stop(), 2000);
    }
    
    // Initial visualization
    generateVisualization('overview');
    
    // Listen for view change events
    window.addEventListener('change-visualization-view', (event) => {
        generateVisualization(event.detail.view);
    });
}

// Role Permission Visualization
function initRolePermissionVisualization() {
    const container = document.getElementById('role-permission-visualization');
    if (!container) return;
    
    // Default role data
    let currentRole = 'financial-analyst';
    
    // Function to update visualization based on selected role
    function updateRoleVisualization(role) {
        // Clear previous visualization
        container.innerHTML = '';
        
        // Set dimensions
        const width = container.clientWidth;
        const height = container.clientHeight;
        
        // Create SVG
        const svg = d3.select(container)
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .attr('viewBox', [0, 0, width, height]);
        
        // Role data definitions
        const roleData = {
            'financial-analyst': {
                title: 'Financial Analyst',
                description: 'Analyzes financial data and prepares reports',
                permissions: [
                    { category: 'Applications', items: ['Bloomberg Terminal (View)', 'Financial Reporting System', 'Microsoft Office Suite'] },
                    { category: 'Databases', items: ['Financial Database (Read)', 'Market Data (Read)', 'Report Repository (Read/Write)'] },
                    { category: 'File Systems', items: ['Finance Department Share (Read/Write)', 'Company Reports (Read)'] },
                    { category: 'Communication', items: ['Email', 'Teams Finance Channels', 'All-Company Channels'] }
                ]
            },
            'trading-manager': {
                title: 'Trading Manager',
                description: 'Oversees trading operations and manages trading team',
                permissions: [
                    { category: 'Applications', items: ['Trading Platform (Full)', 'Risk Management System', 'Bloomberg Terminal (Full)', 'Microsoft Office Suite'] },
                    { category: 'Databases', items: ['Trading Database (Read/Write)', 'Customer Data (Read)', 'Market Data (Read/Write)', 'Transaction Logs (Read)'] },
                    { category: 'File Systems', items: ['Trading Department Share (Full)', 'Compliance Documents (Read)', 'Executive Reports (Read)'] },
                    { category: 'Communication', items: ['Email', 'Teams Trading Channels', 'All-Company Channels', 'Executive Channel'] }
                ]
            },
            'compliance-officer': {
                title: 'Compliance Officer',
                description: 'Ensures regulatory compliance across operations',
                permissions: [
                    { category: 'Applications', items: ['Compliance Monitoring System', 'Regulatory Reporting Tools', 'Audit System', 'Microsoft Office Suite'] },
                    { category: 'Databases', items: ['Transaction Logs (Read)', 'Trading Database (Read)', 'Customer Data (Read)', 'Employee Records (Read)'] },
                    { category: 'File Systems', items: ['Compliance Share (Full)', 'Department Policies (Read)', 'Regulatory Documents (Read/Write)'] },
                    { category: 'Communication', items: ['Email', 'Teams Compliance Channels', 'All-Company Channels', 'Regulatory Announcements'] }
                ]
            },
            'it-support': {
                title: 'IT Support Specialist',
                description: 'Provides technical support and system maintenance',
                permissions: [
                    { category: 'Applications', items: ['IT Service Desk', 'System Monitoring Tools', 'Network Management', 'User Administration'] },
                    { category: 'Databases', items: ['System Logs (Read/Write)', 'User Directory (Read)', 'Configuration DB (Read/Write)'] },
                    { category: 'File Systems', items: ['IT Department Share (Full)', 'Software Repository (Read)', 'System Backup (Read/Write)'] },
                    { category: 'Communication', items: ['Email', 'Teams IT Channels', 'All-Company Channels', 'Emergency Notifications'] }
                ]
            },
            'executive': {
                title: 'Executive',
                description: 'Senior leadership responsible for strategic decisions',
                permissions: [
                    { category: 'Applications', items: ['Executive Dashboard', 'Bloomberg Terminal (Full)', 'Financial Planning System', 'Microsoft Office Suite'] },
                    { category: 'Databases', items: ['Executive Reports (Read)', 'Financial Summaries (Read)', 'Strategic Planning (Read/Write)'] },
                    { category: 'File Systems', items: ['Executive Share (Full)', 'Department Reports (Read)', 'Board Documents (Read/Write)'] },
                    { category: 'Communication', items: ['Email', 'Teams Executive Channels', 'All-Company Channels', 'Board Communications'] }
                ]
            }
        };
        
        // Get the selected role data
        const data = roleData[role];
        if (!data) return;
        
        // Role title
        svg.append('text')
            .attr('x', width / 2)
            .attr('y', 30)
            .attr('text-anchor', 'middle')
            .attr('font-size', 18)
            .attr('font-weight', 'bold')
            .text(data.title);
        
        // Role description
        svg.append('text')
            .attr('x', width / 2)
            .attr('y', 55)
            .attr('text-anchor', 'middle')
            .attr('font-size', 14)
            .text(data.description);
        
        // Create sunburst visualization
        const radius = Math.min(width, height) / 2 - 60;
        
        // Transform the permission data into a hierarchical structure
        const root = {
            name: data.title,
            children: data.permissions.map(category => ({
                name: category.category,
                children: category.items.map(item => ({
                    name: item,
                    value: 1
                }))
            }))
        };
        
        // Create hierarchy and partition layout
        const hierarchy = d3.hierarchy(root)
            .sum(d => d.value);
        
        const partition = d3.partition()
            .size([2 * Math.PI, radius]);
        
        const arc = d3.arc()
            .startAngle(d => d.x0)
            .endAngle(d => d.x1)
            .innerRadius(d => d.y0)
            .outerRadius(d => d.y1);
        
        // Apply the partition layout
        const root_partitioned = partition(hierarchy);
        
        // Color scale
        const colorScale = d3.scaleOrdinal()
            .domain(data.permissions.map(p => p.category))
            .range(['#3A86FF', '#FF006E', '#FB5607', '#8338EC']);
        
        // Create a group for the sunburst
        const g = svg.append('g')
            .attr('transform', `translate(${width / 2}, ${height / 2 + 30})`);
        
        // Draw the arcs
        g.selectAll('path')
            .data(root_partitioned.descendants().slice(1)) // Skip the root
            .join('path')
            .attr('d', arc)
            .style('fill', d => {
                while (d.depth > 1) d = d.parent;
                return colorScale(d.data.name);
            })
            .style('stroke', 'white')
            .style('stroke-width', 1)
            .style('opacity', 0.8)
            .on('mouseover', function(event, d) {
                d3.select(this)
                    .style('opacity', 1)
                    .style('stroke-width', 2);
                
                // Show tooltip
                tooltip.style('opacity', 1)
                    .html(`<strong>${d.data.name}</strong>`)
                    .style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY - 10) + 'px');
            })
            .on('mouseout', function() {
                d3.select(this)
                    .style('opacity', 0.8)
                    .style('stroke-width', 1);
                
                // Hide tooltip
                tooltip.style('opacity', 0);
            });
        
        // Add labels
        g.selectAll('text')
            .data(root_partitioned.descendants().filter(d => d.depth === 1))
            .join('text')
            .attr('transform', d => {
                const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
                const y = (d.y0 + d.y1) / 2;
                return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
            })
            .attr('dy', '0.35em')
            .attr('text-anchor', d => (d.x0 + d.x1) / 2 < Math.PI ? 'start' : 'end')
            .attr('font-size', 12)
            .attr('font-weight', 'bold')
            .text(d => d.data.name);
        
        // Add tooltip
        const tooltip = d3.select('body').append('div')
            .attr('class', 'tooltip')
            .style('position', 'absolute')
            .style('background', 'rgba(0, 0, 0, 0.7)')
            .style('color', 'white')
            .style('padding', '5px 10px')
            .style('border-radius', '4px')
            .style('font-size', '12px')
            .style('pointer-events', 'none')
            .style('opacity', 0);
    }
    
    // Initial visualization
    updateRoleVisualization(currentRole);
    
    // Listen for role change events
    window.addEventListener('change-role-visualization', (event) => {
        updateRoleVisualization(event.detail.role);
    });
}

// Onboarding Process Visualization
function initOnboardingVisualization() {
    const container = document.getElementById('onboarding-visualization');
    if (!container) return;
    
    // Set dimensions
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    // Create SVG
    const svg = d3.select(container)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', [0, 0, width, height]);
    
    // Process steps - old vs new
    const processSteps = [
        {
            stage: 'Request',
            old: 'Manual form submission',
            new: 'Self-service portal request',
            oldTime: '1 day',
            newTime: '10 min',
            x: width * 0.14
        },
        {
            stage: 'Approval',
            old: 'Multiple approvers chain',
            new: 'Role-based auto-approval',
            oldTime: '2-3 days',
            newTime: '0-4 hours',
            x: width * 0.29
        },
        {
            stage: 'Permission Setup',
            old: 'Manual AD group assignment',
            new: 'Automated role assignment',
            oldTime: '1-2 days',
            newTime: '5 min',
            x: width * 0.43
        },
        {
            stage: 'License Assignment',
            old: 'Separate license request',
            new: 'Included in role package',
            oldTime: '1 day',
            newTime: 'Immediate',
            x: width * 0.57
        },
        {
            stage: 'Verification',
            old: 'Manual testing by IT',
            new: 'Automated verification',
            oldTime: '0.5 day',
            newTime: '2 min',
            x: width * 0.71
        },
        {
            stage: 'Notification',
            old: 'Email to requester',
            new: 'Automated notifications & dashboard',
            oldTime: '0.5 day',
            newTime: 'Immediate',
            x: width * 0.86
        }
    ];
    
    // Draw the process flow
    
    // Timeline bar
    svg.append('line')
        .attr('x1', width * 0.1)
        .attr('y1', height * 0.5)
        .attr('x2', width * 0.9)
        .attr('y2', height * 0.5)
        .attr('stroke', '#ccc')
        .attr('stroke-width', 3);
    
    // Timeline points and labels
    processSteps.forEach((step, i) => {
        // Timeline points
        svg.append('circle')
            .attr('cx', step.x)
            .attr('cy', height * 0.5)
            .attr('r', 8)
            .attr('fill', '#3A86FF');
        
        // Stage name
        svg.append('text')
            .attr('x', step.x)
            .attr('y', height * 0.5 - 35) // Moved further up
            .attr('text-anchor', 'middle')
            .attr('font-weight', 'bold')
            .attr('font-size', 12)
            .text(step.stage);

        // Define positions and offsets
        const wrapWidth = width * 0.12; // Keep adjusted wrap width
        const oldTextY = height * 0.15; // Position Current block even higher
        const newTextY = height * 0.85; // Position New block even lower
        const timeYOffset = 30; // Keep increased offset for time labels
        const lineStartY = height * 0.5;
        const oldLineEndY = oldTextY - 5; // Adjust connector end based on new oldTextY
        // Define positions and offsets (Connector lines removed)
        const wrapWidth = width * 0.12; // Keep adjusted wrap width
        const oldTextY = height * 0.15; // Position Current block even higher
        const newTextY = height * 0.85; // Position New block even lower
        const timeYOffset = 30; // Keep increased offset for time labels
        // NOTE: Variables wrapWidth, oldTextY, newTextY, timeYOffset are defined above the loop now.

        // Helper function for text wrapping (adjusts internal x)
        function wrap(text, width, xPos) { // Added xPos parameter
            text.each(function() {
                var text = d3.select(this),
                    words = text.text().split(/\s+/).reverse(),
                    word,
                    line = [],
                    lineNumber = 0,
                    lineHeight = 1.1, // ems
                    // x = text.attr("x"), // Use passed xPos instead
                    y = text.attr("y"),
                    dy = 0, // Adjust dy based on font size or desired spacing
                    tspan = text.text(null)
                                .append("tspan")
                                .attr("x", xPos) // Use passed xPos
                                .attr("y", y)
                                .attr("dy", dy + "em");
                while (word = words.pop()) {
                    line.push(word);
                    tspan.text(line.join(" "));
                    if (tspan.node().getComputedTextLength() > width) {
                        line.pop();
                        tspan.text(line.join(" "));
                        line = [word];
                        tspan = text.append("tspan")
                                    .attr("x", xPos) // Use passed xPos
                                    .attr("y", y)
                                    .attr("dy", ++lineNumber * lineHeight + dy + "em")
                                    .text(word);
                    }
                }
                // // Center the block of text vertically (Removed this logic)
                // const numLines = text.selectAll("tspan").size();
                // if (numLines > 1) {
                //     text.selectAll("tspan").attr("dy", function(d, i) {
                //         // Calculate the initial offset to center the block
                //         const initialOffset = - (numLines - 1) * lineHeight / 2;
                //         return (initialOffset + i * lineHeight) + "em";
                //     });
                // }
            });
        }

        // Current process
        svg.append('text')
            .attr('x', step.x + 12) // Offset X
            .attr('y', oldTextY)
            .attr('text-anchor', 'start') // Anchor start
            .attr('fill', '#dc3545')
            .attr('font-size', 10) // Keep font size
            .text(step.old)
            .call(wrap, wrapWidth, step.x + 12); // Apply wrapping with adjusted x

        svg.append('text')
            .attr('x', step.x + 12) // Offset X
            .attr('y', oldTextY + timeYOffset)
            .attr('text-anchor', 'start') // Anchor start
            .attr('fill', '#dc3545')
            .attr('font-size', 9) // Keep font size
            .text(step.oldTime);

        // New process
        svg.append('text')
            .attr('x', step.x + 12) // Offset X
            .attr('y', newTextY)
            .attr('text-anchor', 'start') // Anchor start
            .attr('fill', '#198754')
            .attr('font-size', 10) // Keep font size
            .text(step.new)
            .call(wrap, wrapWidth, step.x + 12); // Apply wrapping with adjusted x

        svg.append('text')
            .attr('x', step.x + 12) // Offset X
            .attr('y', newTextY + timeYOffset)
            .attr('text-anchor', 'start') // Anchor start
            .attr('fill', '#198754')
            .attr('font-size', 9) // Increased font size
            .text(step.newTime);
    });

    // Titles
    // Old process title
    svg.append('text')
        .attr('x', width * 0.05)
        .attr('y', height * 0.15) // Align with new Current block Y
        .attr('text-anchor', 'start')
        .attr('font-weight', 'bold')
        .attr('fill', '#dc3545')
        .text('Currenddd:');

    // New process title
    svg.append('text')
        .attr('x', width * 0.05)
        .attr('y', height * 0.85) // Align with new New block Y
        .attr('text-anchor', 'start')
        .attr('font-weight', 'bold')
        .attr('fill', '#198754')
        .text('New:');
}
