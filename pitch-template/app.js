document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('data.json');
        const data = await response.json();

        // 1. Populate Text Elements & KPI Cards
        document.title = `${data.companyName} | Growth Dashboard`;
        document.getElementById('company-name').textContent = data.companyName;
        document.getElementById('funding-stage').textContent = `${data.fundingAmount} - ${data.fundingStage}`;
        document.getElementById('problem-statement').textContent = "Threat: " + data.problemStatement;
        document.getElementById('cta-button').href = `mailto:${data.contactEmail}?subject=Regarding the B2B Growth Autopsy`;

        // Populate Sidebar
        const compList = document.getElementById('sidebar-competitors');
        data.sidebarData.competitors.forEach(comp => {
            compList.innerHTML += `
                <li class="bg-gray-800/40 p-3 rounded-lg border border-gray-700/50 shadow-sm">
                    <div class="text-white font-semibold text-sm flex items-center"><span class="w-2 h-2 rounded-full bg-red-500 mr-2 shadow-[0_0_8px_rgba(239,68,68,0.6)]"></span>${comp.name}</div>
                    <div class="text-xs text-brandAccent mt-1.5 font-medium leading-snug">Targets: <span class="text-gray-300 font-normal">${comp.targets}</span></div>
                </li>
            `;
        });

        const nicheList = document.getElementById('sidebar-micro-niche');
        data.sidebarData.microNiche.forEach(niche => {
            nicheList.innerHTML += `
                <li class="flex items-start space-x-3 bg-gray-800/40 p-3 rounded-lg border border-gray-700/50 shadow-sm">
                    <span class="text-green-400 text-sm mt-0.5">💰</span>
                    <span class="text-gray-200 text-xs leading-snug font-medium">${niche}</span>
                </li>
            `;
        });

        document.getElementById('metric-funding').textContent = data.fundingAmount;
        document.getElementById('metric-keywords').textContent = data.metrics.missingKeywords + "+";
        document.getElementById('metric-seo-errors').textContent = data.metrics.seoErrors;
        document.getElementById('metric-leak').textContent = data.metrics.revenueLeak;

        // 2. Populate SEO Error List
        const errorList = document.getElementById('seo-error-list');
        data.seoErrors.forEach(error => {
            const li = document.createElement('li');
            li.className = 'flex items-center text-sm text-gray-300 bg-gray-800/40 p-2 rounded border border-gray-700/50';
            li.innerHTML = `<span class="w-2 h-2 rounded-full bg-red-500 mr-3"></span> ${error}`;
            errorList.appendChild(li);
        });

        // 3. Populate Keyword Table
        const tableBody = document.getElementById('keyword-table-body');
        data.keywords.forEach(kw => {
            const row = document.createElement('tr');
            row.className = 'hover:bg-gray-800/60 transition-colors group';
            
            let intentBadge = 'bg-gray-500/20 text-gray-400 border-gray-500/30';
            if(kw.intent.includes('HIGH')) intentBadge = 'bg-red-500/20 text-red-400 border-red-500/30';
            if(kw.intent.includes('TRANSACTIONAL')) intentBadge = 'bg-purple-500/20 text-purple-400 border-purple-500/30';
            if(kw.intent.includes('MEDIUM')) intentBadge = 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';

            row.innerHTML = `
                <td class="p-3 font-medium text-gray-200 group-hover:text-brand transition-colors">${kw.keyword}</td>
                <td class="p-3"><span class="border ${intentBadge} py-1 px-2 rounded-md text-[10px] font-bold tracking-wide">${kw.intent}</span></td>
                <td class="p-3 text-gray-400 text-xs">${kw.ranking}</td>
                <td class="p-3 text-gray-300 text-xs font-medium">${kw.opportunity}</td>
            `;
            tableBody.appendChild(row);
        });

        // 4. Render Chart.js
        const ctx = document.getElementById('competitorChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.competitors.labels,
                datasets: [{
                    label: 'Traffic Share',
                    data: data.competitors.data,
                    backgroundColor: ['rgba(14, 165, 233, 0.8)', 'rgba(139, 92, 246, 0.5)', 'rgba(16, 185, 129, 0.5)'],
                    borderRadius: 4,
                    borderWidth: 1,
                    borderColor: 'rgba(255,255,255,0.05)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { 
                        beginAtZero: true, 
                        grid: { color: 'rgba(255,255,255,0.05)' },
                        ticks: { color: '#94a3b8', font: { size: 10 } }
                    },
                    x: { 
                        grid: { display: false },
                        ticks: { color: '#94a3b8', font: { size: 11 } }
                    }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });

        // Transition: Hide Loading, Show App
        setTimeout(() => {
            document.getElementById('loading').classList.add('hidden');
            const app = document.getElementById('app-content');
            app.classList.remove('hidden');
            // small delay to let browser render block before fading in
            setTimeout(() => app.classList.remove('opacity-0'), 50);
        }, 500); // Fake small loading delay for "App" feel

    } catch (error) {
        console.error("Error loading data:", error);
        document.getElementById('loading').textContent = "Data failed to load. Please run on local server.";
    }
});
