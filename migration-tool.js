document.addEventListener('DOMContentLoaded', function() {
    // Initialize the migration tool
    initMigrationTool();
});

function initMigrationTool() {
    // Get elements
    const analyzeBtn = document.getElementById('analyze-btn');
    const orgStructureInput = document.getElementById('organization-structure');
    const adGroupsInput = document.getElementById('ad-groups-input');
    const applicationsInput = document.getElementById('applications-input');
    const migrationResults = document.getElementById('migration-results');
    const visualizationCard = document.getElementById('visualization-card');
    
    // Sample data templates
    const loadFinanceTemplate = document.getElementById('load-finance-template');
    const loadTradingTemplate = document.getElementById('load-trading-template');
    const loadITTemplate = document.getElementById('load-it-template');
    
    // Add event listeners
    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', generateMigrationPlan);
    }
    
    if (loadFinanceTemplate) {
        loadFinanceTemplate.addEventListener('click', () => loadTemplate('finance'));
    }
    
    if (loadTradingTemplate) {
        loadTradingTemplate.addEventListener('click', () => loadTemplate('trading'));
    }
    
    if (loadITTemplate) {
        loadITTemplate.addEventListener('click', () => loadTemplate('it'));
    }
    
    // Function to load a template
    function loadTemplate(type) {
        const templates = {
            finance: {
                org: 'Finance Department\n- Accounting\n- Financial Analysis\n- Treasury\n- Financial Reporting',
                groups: 'FIN-Accountants\nFIN-Analysts\nFIN-Treasury\nFIN-Reporting\nFIN-Bloomberg-Users\nFIN-SAP-Basic\nFIN-SAP-Advanced\nFIN-Reports-Readers\nFIN-Reports-Writers\nFIN-DB-Readers\nFIN-DB-Writers',
                apps: 'Bloomberg Terminal\nSAP Financial Module\nFinancial Reporting System\nAccounting Software\nTreasury Management System\nInternal Financial Database'
            },
            trading: {
                org: 'Trading Department\n- Equities Trading\n- Fixed Income\n- FX Trading\n- Derivatives',
                groups: 'Trading-Equities\nTrading-FixedIncome\nTrading-FX\nTrading-Derivatives\nTrading-Bloomberg\nTrading-Reuters\nTrading-Platform-Basic\nTrading-Platform-Advanced\nTrading-Platform-Admin\nTrading-Risk-Viewers\nTrading-DB-Readers\nTrading-DB-Writers',
                apps: 'Trading Platform\nBloomberg Terminal\nReuters Eikon\nRisk Management System\nTrading Database\nRegulatory Reporting Tool'
            },
            it: {
                org: 'IT Department\n- Infrastructure\n- Application Support\n- Service Desk\n- Security',
                groups: 'IT-Admins\nIT-Infrastructure\nIT-AppSupport\nIT-ServiceDesk\nIT-Security\nIT-Dev\nIT-Monitoring\nIT-Network\nIT-Database\nIT-Cloud\nIT-Servers\nIT-Storage',
                apps: 'System Monitoring Tools\nIT Service Management Platform\nNetwork Management System\nServer Administration Tools\nSecurity Management Console\nBackup & Recovery System'
            }
        };
        
        if (templates[type]) {
            orgStructureInput.value = templates[type].org;
            adGroupsInput.value = templates[type].groups;
            applicationsInput.value = templates[type].apps;
            
            // Check appropriate permission model boxes
            document.getElementById('individual-permissions').checked = true;
            document.getElementById('ad-group-permissions').checked = true;
            document.getElementById('role-based-permissions').checked = false;
        }
    }
    
    // Function to generate migration plan
    function generateMigrationPlan() {
        const orgStructure = orgStructureInput.value.trim();
        const adGroups = adGroupsInput.value.trim();
        const applications = applicationsInput.value.trim();
        
        if (!orgStructure || !adGroups || !applications) {
            alert('Please fill in all required fields to generate a migration plan.');
            return;
        }
        
        // Parse input data
        const orgLines = orgStructure.split('\n').filter(line => line.trim());
        const adGroupsList = adGroups.split('\n').filter(line => line.trim());
        const appsList = applications.split('\n').filter(line => line.trim());
        
        // Determine the department from the input
        let department = "Generic Department";
        if (orgLines.length > 0) {
            department = orgLines[0].trim().replace(/\r$/, '');
        }
        
        // Generate migration analysis HTML
        migrationResults.innerHTML = generateAnalysisHtml(department, orgLines, adGroupsList, appsList);
        
        // Show visualization card
        visualizationCard.style.display = 'block';
        
        // Generate visualizations
        generateMigrationVisualizations(department, orgLines, adGroupsList, appsList);
    }
    
    // Function to generate analysis HTML
    function generateAnalysisHtml(department, orgLines, adGroupsList, appsList) {
        // Identify department type to customize recommendations
        let departmentType = 'generic';
        
        if (department.toLowerCase().includes('financ')) departmentType = 'finance';
        else if (department.toLowerCase().includes('trad')) departmentType = 'trading';
        else if (department.toLowerCase().includes('it')) departmentType = 'it';
        
        // Group the AD groups by purpose based on naming patterns
        const groupCategories = categorizeGroups(adGroupsList, departmentType);
        
        // Identify functional roles based on department structure and groups
        const functionalRoles = identifyFunctionalRoles(orgLines, adGroupsList, departmentType);
        
        // Generate HTML
        let html = `
            <div class="analysis-section mb-4">
                <h4 class="mb-3">Analysis Summary</h4>
                <div class="alert alert-info">
                    <p><strong>${department}</strong> has been analyzed with the following findings:</p>
                    <ul class="mb-0">
                        <li><strong>${orgLines.length}</strong> organizational units identified</li>
                        <li><strong>${adGroupsList.length}</strong> Active Directory groups analyzed</li>
                        <li><strong>${appsList.length}</strong> applications in use</li>
                        <li><strong>${functionalRoles.length}</strong> functional roles identified</li>
                        <li><strong>${Object.keys(groupCategories).length}</strong> permission categories detected</li>
                    </ul>
                </div>
            </div>

            <div class="analysis-section mb-4">
                <h4 class="mb-3">Identified Role Structure</h4>
                <p>Based on your current environment, we recommend the following role structure in Entra ID:</p>
                <div class="table-responsive">
                    <table class="table table-bordered">
                        <thead class="table-light">
                            <tr>
                                <th>Business Function</th>
                                <th>Roles</th>
                                <th>Entra ID Implementation</th>
                            </tr>
                        </thead>
                        <tbody>
        `;
        
        // Generate role recommendations
        let previousFunction = '';
        functionalRoles.forEach(role => {
            html += `
                <tr>
                    <td>${role.businessFunction !== previousFunction ? role.businessFunction : ''}</td>
                    <td>
                        <strong>${role.roleName}</strong>
                        <div class="small text-muted">${role.description}</div>
                    </td>
                    <td>
                        <div class="mb-2">
                            <span class="badge bg-primary">Administrative Unit</span> ${department}
                        </div>
                        <div class="mb-2">
                            <span class="badge bg-secondary">Security Group</span> ${role.groupName}
                        </div>
                        ${role.dynamicGroup ? `
                        <div>
                            <span class="badge bg-info">Dynamic Group Rule</span>
                            <code class="small">${role.dynamicGroup}</code>
                        </div>
                        ` : ''}
                    </td>
                </tr>
            `;
            previousFunction = role.businessFunction;
        });
        
        html += `
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="analysis-section mb-4">
                <h4 class="mb-3">Permission Mapping Recommendations</h4>
                <p>Your current AD groups should be reorganized into the following permission structure:</p>
                <div class="row">
        `;
        
        // Generate permission recommendations
        Object.keys(groupCategories).forEach(category => {
            html += `
                <div class="col-md-6 mb-3">
                    <div class="card h-100">
                        <div class="card-header bg-light">
                            <h5 class="mb-0">${category} Permissions</h5>
                        </div>
                        <div class="card-body">
                            <p class="small text-muted">${getPermissionCategoryDescription(category)}</p>
                            <h6>Current AD Groups:</h6>
                            <ul class="small">
                                ${groupCategories[category].map(group => `<li>${group}</li>`).join('')}
                            </ul>
                            <h6 class="mt-3">Recommended Entra ID Structure:</h6>
                            <div class="permission-recommendation">
                                <span class="badge bg-primary mb-2">Entra ID Permission Set</span>
                                <div class="fw-bold">${department}-${category}</div>
                                <p class="small text-muted mb-0">Assigned to roles that require ${category.toLowerCase()} access</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
        
        html += `
                </div>
            </div>

            <div class="analysis-section mb-4">
                <h4 class="mb-3">License Management Recommendations</h4>
                <div class="alert alert-success">
                    <p><strong>Recommendation:</strong> Integrate license management with the new role-based structure by:</p>
                    <ul>
                        <li>Creating license groups in Entra ID that correspond to applications</li>
                        <li>Assigning licenses to groups rather than individual users</li>
                        <li>Automating license assignment through role membership</li>
                    </ul>
                </div>
                <div class="table-responsive">
                    <table class="table table-bordered">
                        <thead class="table-light">
                            <tr>
                                <th>Application</th>
                                <th>Current License Management</th>
                                <th>Recommended Approach</th>
                            </tr>
                        </thead>
                        <tbody>
        `;
        
        // Generate license recommendations
        appsList.forEach(app => {
            const licenseInfo = getLicenseRecommendations(app, departmentType);
            html += `
                <tr>
                    <td><strong>${app}</strong></td>
                    <td>${licenseInfo.current}</td>
                    <td>${licenseInfo.recommended}</td>
                </tr>
            `;
        });
        
        html += `
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        
        return html;
    }
    
    // Function to generate migration visualizations
    function generateMigrationVisualizations(department, orgLines, adGroupsList, appsList) {
        // Generate current structure visualization
        generateCurrentStructureViz(department, adGroupsList);
        
        // Generate proposed structure visualization
        generateProposedStructureViz(department, orgLines, adGroupsList);
        
        // Generate migration steps
        generateMigrationSteps(department, orgLines, adGroupsList, appsList);
    }
    
    // Function to generate current structure visualization
    function generateCurrentStructureViz(department, adGroupsList) {
        const container = document.getElementById('current-structure-visualization');
        if (!container) return;
        
        // Set dimensions
        const width = container.clientWidth;
        const height = container.clientHeight;
        
        // Create SVG
        const svg = d3.select(container)
            .html('') // Clear previous content
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .attr('viewBox', [0, 0, width, height]);
        
        // Sample data for current structure
        const nodes = [
            { id: 'department', label: department, type: 'department', x: width/2, y: 50 }
        ];
        
        const links = [];
        
        // Add AD groups
        adGroupsList.forEach((group, i) => {
            const angle = (i / adGroupsList.length) * 2 * Math.PI;
            const radius = 120;
            const x = width/2 + radius * Math.cos(angle);
            const y = 180 + radius * Math.sin(angle);
            
            nodes.push({
                id: `group-${i}`,
                label: group,
                type: 'group',
                x: x,
                y: y
            });
            
            links.push({
                source: 'department',
                target: `group-${i}`
            });
        });
        
        // Add sample users
        const userCount = Math.min(8, adGroupsList.length * 2);
        for (let i = 0; i < userCount; i++) {
            const angle = (i / userCount) * 2 * Math.PI;
            const radius = 200;
            const x = width/2 + radius * Math.cos(angle);
            const y = 180 + radius * Math.sin(angle);
            
            nodes.push({
                id: `user-${i}`,
                label: `User ${i+1}`,
                type: 'user',
                x: x,
                y: y
            });
            
            // Connect users to random groups
            const groupCount = 1 + Math.floor(Math.random() * 3); // 1-3 groups per user
            const groupIndices = new Set();
            
            while (groupIndices.size < groupCount) {
                groupIndices.add(Math.floor(Math.random() * adGroupsList.length));
            }
            
            groupIndices.forEach(groupIndex => {
                links.push({
                    source: `user-${i}`,
                    target: `group-${groupIndex}`
                });
            });
        }
        
        // Draw the visualization
        drawNetworkDiagram(svg, nodes, links, width, height, 'Current Permission Structure');
    }
    
    // Function to generate proposed structure visualization
    function generateProposedStructureViz(department, orgLines, adGroupsList) {
        const container = document.getElementById('proposed-structure-visualization');
        if (!container) return;
        
        // Set dimensions
        const width = container.clientWidth;
        const height = container.clientHeight;
        
        // Create SVG
        const svg = d3.select(container)
            .html('') // Clear previous content
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .attr('viewBox', [0, 0, width, height]);
        
        // Determine department type
        let departmentType = 'generic';
        if (department.toLowerCase().includes('financ')) departmentType = 'finance';
        else if (department.toLowerCase().includes('trad')) departmentType = 'trading';
        else if (department.toLowerCase().includes('it')) departmentType = 'it';
        
        // Extract subdepartments
        const subdepartments = orgLines.slice(1)
            .filter(line => line.trim().startsWith('-'))
            .map(line => line.trim().substring(1).trim());
        
        // Identify functional roles
        const functionalRoles = identifyFunctionalRoles(orgLines, adGroupsList, departmentType);
        
        // Group the AD groups by purpose
        const groupCategories = categorizeGroups(adGroupsList, departmentType);
        
        // Sample data for proposed structure
        const nodes = [
            { id: 'entraID', label: 'Microsoft Entra ID', type: 'cloud', x: width/2, y: 30 },
            { id: 'adminUnit', label: `${department} (Admin Unit)`, type: 'department', x: width/2, y: 90 }
        ];
        
        const links = [
            { source: 'entraID', target: 'adminUnit' }
        ];
        
        // Add roles
        const roleCount = Math.min(4, functionalRoles.length);
        for (let i = 0; i < roleCount; i++) {
            const role = functionalRoles[i];
            const x = width * (0.2 + 0.6 * (i / (roleCount - 1)));
            
            nodes.push({
                id: `role-${i}`,
                label: role.roleName,
                type: 'role',
                x: x,
                y: 150
            });
            
            links.push({
                source: 'adminUnit',
                target: `role-${i}`
            });
        }
        
        // Add permission sets
        const categories = Object.keys(groupCategories);
        const permissionCount = Math.min(4, categories.length);
        
        for (let i = 0; i < permissionCount; i++) {
            const category = categories[i];
            const x = width * (0.2 + 0.6 * (i / (permissionCount - 1)));
            
            nodes.push({
                id: `perm-${i}`,
                label: `${category} Permissions`,
                type: 'permission',
                x: x,
                y: 210
            });
            
            // Connect permissions to roles that need them
            for (let j = 0; j < roleCount; j++) {
                if (Math.random() > 0.3) { // 70% chance a role needs this permission
                    links.push({
                        source: `role-${j}`,
                        target: `perm-${i}`
                    });
                }
            }
        }
        
        // Add users
        const userCount = Math.min(4, functionalRoles.length * 2);
        for (let i = 0; i < userCount; i++) {
            const x = width * (0.2 + 0.6 * (i / (userCount - 1)));
            
            nodes.push({
                id: `user-${i}`,
                label: `User ${i+1}`,
                type: 'user',
                x: x,
                y: 270
            });
            
            // Connect users to roles (simpler structure)
            const roleIndex = i % roleCount;
            links.push({
                source: `user-${i}`,
                target: `role-${roleIndex}`
            });
        }
        
        // Draw the visualization
        drawNetworkDiagram(svg, nodes, links, width, height, 'Proposed Role-Based Structure');
    }
    
    // Function to generate migration steps
    function generateMigrationSteps(department, orgLines, adGroupsList, appsList) {
        const container = document.getElementById('migration-steps-container');
        if (!container) return;
        
        // Determine department type
        let departmentType = 'generic';
        if (department.toLowerCase().includes('financ')) departmentType = 'finance';
        else if (department.toLowerCase().includes('trad')) departmentType = 'trading';
        else if (department.toLowerCase().includes('it')) departmentType = 'it';
        
        // Generate steps
        const migrationSteps = [
            {
                title: 'Discovery & Analysis',
                tasks: [
                    'Document all existing AD groups and their members',
                    'Map existing applications and required permissions',
                    'Interview key stakeholders to understand workflows',
                    'Identify license dependencies and usage patterns'
                ]
            },
            {
                title: 'Entra ID Foundation Setup',
                tasks: [
                    `Create "${department}" Administrative Unit in Entra ID`,
                    'Establish naming conventions for all security groups',
                    'Set up attribute synchronization between on-premises AD and Entra ID',
                    'Configure Entra ID Connect sync settings for the department'
                ]
            },
            {
                title: 'Role Design & Implementation',
                tasks: [
                    'Create security groups for each identified role',
                    'Define dynamic membership rules where applicable',
                    'Set up permission inheritance hierarchy',
                    `Implement license groups for ${appsList.slice(0, 2).join(' and ')} applications`
                ]
            },
            {
                title: 'Migration Execution',
                tasks: [
                    'Perform parallel assignment for a pilot group of users',
                    'Validate access and troubleshoot permission issues',
                    'Gradually migrate remaining users by role',
                    'Monitor access logs to ensure proper permission translation'
                ]
            },
            {
                title: 'Decommissioning & Governance',
                tasks: [
                    'Document the new permission structure',
                    'Create onboarding templates for new users',
                    'Establish regular review process for roles and permissions',
                    'Set up automated reporting for license usage and access patterns'
                ]
            }
        ];
        
        // Generate HTML for steps
        let html = '';
        migrationSteps.forEach((step, index) => {
            html += `
                <div class="migration-step card mb-3">
                    <div class="card-header bg-light d-flex align-items-center">
                        <div class="step-number">${index + 1}</div>
                        <h5 class="mb-0">${step.title}</h5>
                    </div>
                    <div class="card-body">
                        <ul class="step-tasks">
                            ${step.tasks.map(task => `<li>${task}</li>`).join('')}
                        </ul>
                        <div class="step-timeframe small text-muted mt-2">
                            <strong>Estimated timeframe:</strong> ${getTimeframeEstimate(index)}
                        </div>
                    </div>
                </div>
            `;
        });
        
        // Add timeframe guidance
        html += `
            <div class="alert alert-info mt-3">
                <i class="bi bi-info-circle-fill me-2"></i>
                <strong>Total Migration Timeframe:</strong> Approximately 6-8 weeks for complete implementation, with parallel operations during transition.
            </div>
        `;
        
        container.innerHTML = html;
        
        // Add CSS for step numbers
        const style = document.createElement('style');
        style.textContent = `
            .step-number {
                width: 30px;
                height: 30px;
                border-radius: 50%;
                background-color: var(--primary-color);
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                margin-right: 10px;
            }
            
            .step-tasks {
                padding-left: 20px;
            }
            
            .step-tasks li {
                margin-bottom: 8px;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Helper function to draw a network diagram
    function drawNetworkDiagram(svg, nodes, links, width, height, title) {
        // Add title
        svg.append('text')
            .attr('x', width / 2)
            .attr('y', 20)
            .attr('text-anchor', 'middle')
            .attr('font-size', 14)
            .attr('font-weight', 'bold')
            .text(title);
        
        // Define color scale
        const colorScale = d3.scaleOrdinal()
            .domain(['department', 'group', 'user', 'cloud', 'role', 'permission'])
            .range(['#3A86FF', '#FB5607', '#06D6A0', '#8338EC', '#FF006E', '#FFBE0B']);
        
        // Define arrow marker
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
        svg.selectAll('.link')
            .data(links)
            .join('line')
            .attr('class', 'link')
            .attr('x1', d => {
                const source = nodes.find(n => n.id === d.source || n.id === d.source.id);
                return source ? source.x : 0;
            })
            .attr('y1', d => {
                const source = nodes.find(n => n.id === d.source || n.id === d.source.id);
                return source ? source.y : 0;
            })
            .attr('x2', d => {
                const target = nodes.find(n => n.id === d.target || n.id === d.target.id);
                return target ? target.x : 0;
            })
            .attr('y2', d => {
                const target = nodes.find(n => n.id === d.target || n.id === d.target.id);
                return target ? target.y : 0;
            })
            .attr('stroke', '#999')
            .attr('stroke-width', 1)
            .attr('marker-end', 'url(#arrowhead)');
        
        // Draw nodes
        const nodeGroups = svg.selectAll('.node')
            .data(nodes)
            .join('g')
            .attr('class', 'node')
            .attr('transform', d => `translate(${d.x}, ${d.y})`);
        
        // Node shapes
        nodeGroups.each(function(d) {
            const node = d3.select(this);
            
            if (d.type === 'cloud') {
                // Cloud shape for Entra ID
                node.append('ellipse')
                    .attr('rx', 60)
                    .attr('ry', 25)
                    .attr('fill', colorScale(d.type))
                    .attr('stroke', 'white')
                    .attr('stroke-width', 2);
            } else if (d.type === 'user') {
                // Circle for users
                node.append('circle')
                    .attr('r', 15)
                    .attr('fill', colorScale(d.type))
                    .attr('stroke', 'white')
                    .attr('stroke-width', 2);
            } else {
                // Rectangle for other types
                const width = d.type === 'department' ? 140 : (d.type === 'role' ? 100 : 90);
                const height = 30;
                
                node.append('rect')
                    .attr('x', -width / 2)
                    .attr('y', -height / 2)
                    .attr('width', width)
                    .attr('height', height)
                    .attr('rx', 5)
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
                .attr('font-size', d.type === 'user' ? 8 : 10)
                .text(d.label.length > 15 ? d.label.substring(0, 13) + '...' : d.label);
        });
        
        // Add tooltips
        nodeGroups.append('title')
            .text(d => d.label);
    }
    
    // Helper function to categorize AD groups
    function categorizeGroups(groups, departmentType) {
        const categories = {};
        
        groups.forEach(group => {
            let category = 'General';
            const groupLower = group.toLowerCase();
            
            if (groupLower.includes('admin') || groupLower.includes('manage')) {
                category = 'Administrative';
            } else if (groupLower.includes('read') || groupLower.includes('view')) {
                category = 'ReadOnly';
            } else if (groupLower.includes('write') || groupLower.includes('edit')) {
                category = 'DataModification';
            } else if (groupLower.includes('db') || groupLower.includes('database')) {
                category = 'Database';
            } else if (groupLower.includes('app') || groupLower.includes('application')) {
                category = 'Application';
            } else if (groupLower.includes('bloomberg') || groupLower.includes('reuters')) {
                category = 'MarketData';
            } else if (groupLower.includes('report')) {
                category = 'Reporting';
            } else if (groupLower.includes('compliance') || groupLower.includes('regul')) {
                category = 'Compliance';
            } else if (groupLower.includes('trad')) {
                category = 'Trading';
            } else if (groupLower.includes('fin')) {
                category = 'Financial';
            } else if (groupLower.includes('it') || groupLower.includes('tech')) {
                category = 'Technical';
            }
            
            // Add to appropriate category
            if (!categories[category]) {
                categories[category] = [];
            }
            categories[category].push(group);
        });
        
        return categories;
    }
    
    // Helper function to identify functional roles
    function identifyFunctionalRoles(orgLines, adGroups, departmentType) {
        const roles = [];
        
        // Extract subdepartments
        const subdepartments = orgLines.slice(1)
            .filter(line => line.trim().startsWith('-'))
            .map(line => line.trim().substring(1).trim());
        
        if (departmentType === 'finance') {
            roles.push(
                {
                    businessFunction: 'Finance',
                    roleName: 'Financial Analyst',
                    description: 'Analyzes financial data and creates reports',
                    groupName: 'ROLE-Finance-Analyst',
                    dynamicGroup: 'user.department -eq "Finance" -and user.jobTitle -contains "Analyst"'
                },
                {
                    businessFunction: 'Finance',
                    roleName: 'Finance Manager',
                    description: 'Oversees financial operations and approves transactions',
                    groupName: 'ROLE-Finance-Manager',
                    dynamicGroup: 'user.department -eq "Finance" -and user.jobTitle -contains "Manager"'
                },
                {
                    businessFunction: 'Finance',
                    roleName: 'Accounting Specialist',
                    description: 'Manages accounting processes and reconciliations',
                    groupName: 'ROLE-Finance-Accounting',
                    dynamicGroup: null
                }
            );
            
            // Add subdepartment-specific roles
            subdepartments.forEach(subdept => {
                if (subdept.includes('Treasury')) {
                    roles.push({
                        businessFunction: 'Treasury',
                        roleName: 'Treasury Analyst',
                        description: 'Manages cash flow and investments',
                        groupName: 'ROLE-Treasury-Analyst',
                        dynamicGroup: null
                    });
                } else if (subdept.includes('Report')) {
                    roles.push({
                        businessFunction: 'Financial Reporting',
                        roleName: 'Reporting Specialist',
                        description: 'Prepares financial statements and regulatory reports',
                        groupName: 'ROLE-Finance-Reporting',
                        dynamicGroup: null
                    });
                }
            });
        } else if (departmentType === 'trading') {
            roles.push(
                {
                    businessFunction: 'Trading',
                    roleName: 'Trader',
                    description: 'Executes trades and manages positions',
                    groupName: 'ROLE-Trading-Trader',
                    dynamicGroup: 'user.department -eq "Trading" -and user.jobTitle -contains "Trader"'
                },
                {
                    businessFunction: 'Trading',
                    roleName: 'Trading Manager',
                    description: 'Oversees trading operations and risk',
                    groupName: 'ROLE-Trading-Manager',
                    dynamicGroup: 'user.department -eq "Trading" -and user.jobTitle -contains "Manager"'
                },
                {
                    businessFunction: 'Trading',
                    roleName: 'Trading Assistant',
                    description: 'Supports trading operations and administration',
                    groupName: 'ROLE-Trading-Assistant',
                    dynamicGroup: null
                }
            );
            
            // Add subdepartment-specific roles
            subdepartments.forEach(subdept => {
                if (subdept.includes('Equities')) {
                    roles.push({
                        businessFunction: 'Equities Trading',
                        roleName: 'Equity Trader',
                        description: 'Specializes in equity market trading',
                        groupName: 'ROLE-Equity-Trader',
                        dynamicGroup: null
                    });
                } else if (subdept.includes('Fixed Income')) {
                    roles.push({
                        businessFunction: 'Fixed Income',
                        roleName: 'Fixed Income Trader',
                        description: 'Specializes in bond and interest rate products',
                        groupName: 'ROLE-FixedIncome-Trader',
                        dynamicGroup: null
                    });
                }
            });
        } else if (departmentType === 'it') {
            roles.push(
                {
                    businessFunction: 'IT',
                    roleName: 'IT Support Specialist',
                    description: 'Provides technical support and troubleshooting',
                    groupName: 'ROLE-IT-Support',
                    dynamicGroup: 'user.department -eq "IT" -and user.jobTitle -contains "Support"'
                },
                {
                    businessFunction: 'IT',
                    roleName: 'Systems Administrator',
                    description: 'Manages servers and infrastructure',
                    groupName: 'ROLE-IT-SysAdmin',
                    dynamicGroup: 'user.department -eq "IT" -and user.jobTitle -contains "Administrator"'
                },
                {
                    businessFunction: 'IT',
                    roleName: 'IT Manager',
                    description: 'Oversees IT operations and projects',
                    groupName: 'ROLE-IT-Manager',
                    dynamicGroup: 'user.department -eq "IT" -and user.jobTitle -contains "Manager"'
                }
            );
            
            // Add subdepartment-specific roles
            subdepartments.forEach(subdept => {
                if (subdept.includes('Security')) {
                    roles.push({
                        businessFunction: 'IT Security',
                        roleName: 'Security Analyst',
                        description: 'Monitors and responds to security threats',
                        groupName: 'ROLE-IT-Security',
                        dynamicGroup: null
                    });
                } else if (subdept.includes('Infrastructure')) {
                    roles.push({
                        businessFunction: 'IT Infrastructure',
                        roleName: 'Infrastructure Engineer',
                        description: 'Designs and maintains IT infrastructure',
                        groupName: 'ROLE-IT-Infrastructure',
                        dynamicGroup: null
                    });
                }
            });
        } else {
            // Generic roles
            roles.push(
                {
                    businessFunction: orgLines[0],
                    roleName: 'Department Manager',
                    description: 'Oversees department operations',
                    groupName: `ROLE-${orgLines[0]}-Manager`,
                    dynamicGroup: `user.department -eq "${orgLines[0]}" -and user.jobTitle -contains "Manager"`
                },
                {
                    businessFunction: orgLines[0],
                    roleName: 'Specialist',
                    description: 'Subject matter expert in department area',
                    groupName: `ROLE-${orgLines[0]}-Specialist`,
                    dynamicGroup: null
                },
                {
                    businessFunction: orgLines[0],
                    roleName: 'Administrator',
                    description: 'Handles administrative tasks for the department',
                    groupName: `ROLE-${orgLines[0]}-Admin`,
                    dynamicGroup: null
                }
            );
            
            // Add subdepartment-specific roles
            subdepartments.forEach((subdept, i) => {
                if (i < 2) { // Limit to 2 additional roles for brevity
                    roles.push({
                        businessFunction: subdept,
                        roleName: `${subdept} Specialist`,
                        description: `Works within the ${subdept} area`,
                        groupName: `ROLE-${subdept.replace(/\s+/g, '')}-Specialist`,
                        dynamicGroup: null
                    });
                }
            });
        }
        
        return roles;
    }
    
    // Helper function for permission category descriptions
    function getPermissionCategoryDescription(category) {
        const descriptions = {
            'Administrative': 'High-privilege permissions for system administration and management',
            'ReadOnly': 'View-only access to data and applications',
            'DataModification': 'Ability to create, edit, and update data',
            'Database': 'Access to specific databases and data stores',
            'Application': 'Access to business applications and software',
            'MarketData': 'Access to financial market data services and tools',
            'Reporting': 'Ability to run and generate reports',
            'Compliance': 'Access to compliance-related systems and data',
            'Trading': 'Permissions related to trading systems and operations',
            'Financial': 'Access to financial systems and data',
            'Technical': 'IT systems and technical infrastructure access',
            'General': 'General-purpose permissions not falling into other categories'
        };
        
        return descriptions[category] || 'Group of related permissions';
    }
    
    // Helper function for license recommendations
    function getLicenseRecommendations(app, departmentType) {
        const recommendations = {
            'Bloomberg Terminal': {
                current: 'Individual named user licenses manually assigned',
                recommended: 'Create <code>LICENSE-Bloomberg</code> group in Entra ID, assign licenses to the group, and make it a member of relevant role groups'
            },
            'Reuters Eikon': {
                current: 'Individual named user licenses manually assigned',
                recommended: 'Create <code>LICENSE-Reuters</code> group in Entra ID, assign licenses to the group, and make it a member of relevant role groups'
            },
            'Trading Platform': {
                current: 'Mix of individual and concurrent licenses',
                recommended: 'Create <code>LICENSE-Trading-Platform</code> group with license assignment, implement license reclamation process for inactive users'
            },
            'SAP Financial Module': {
                current: 'Role-based licenses managed in SAP',
                recommended: 'Create <code>LICENSE-SAP-Finance</code> group in Entra ID, integrate with SAP using SCIM connector, automate provisioning based on role assignment'
            },
            'Financial Reporting System': {
                current: 'Department-wide license with individual access',
                recommended: 'Maintain enterprise license, use Entra ID groups for access control without license management'
            },
            'System Monitoring Tools': {
                current: 'IT department licenses manually assigned',
                recommended: 'Create <code>LICENSE-Monitoring</code> group in Entra ID, implement concurrent license pool for optimal utilization'
            }
        };
        
        // Default recommendation if app not in predefined list
        const defaultRecommendation = {
            current: 'Manual license assignment and tracking',
            recommended: `Create <code>LICENSE-${app.replace(/\s+/g, '-')}</code> group in Entra ID, assign licenses to the group instead of individual users`
        };
        
        return recommendations[app] || defaultRecommendation;
    }
    
    // Helper function for timeframe estimates
    function getTimeframeEstimate(stepIndex) {
        const estimates = [
            '1-2 weeks',
            '1 week',
            '2-3 weeks',
            '2-3 weeks',
            '1 week'
        ];
        
        return estimates[stepIndex] || '1-2 weeks';
    }
}

