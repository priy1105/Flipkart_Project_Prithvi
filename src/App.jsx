import React, { useState, useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

// --- SVG Icon for Flipkart Logo ---
const FlipkartLogo = () => (
    <img 
        src="https://static-assets-web.flixcart.com/batman-returns/batman-returns/p/images/fkheaderlogo_plus-055f80.svg" 
        alt="Flipkart Logo" 
        className="h-8 w-auto mr-4"
    />
);


// --- Data Constants ---
const PILLAR_DATA = {
    "pillar-1": {
        title: "Pillar 1: 'Green Tag' Buy-Back Program",
        content: "This innovative, customer-facing program solves the sourcing challenge at its root. By offering a guaranteed, hassle-free buy-back option at the point of new sale for a nominal fee, we create a predictable supply chain of high-quality used devices. This solves major customer pain points like inconvenience and price uncertainty, while creating powerful ecosystem lock-in, increasing Customer Lifetime Value (CLV)."
    },
    "pillar-2": {
        title: "Pillar 2: Centralized Refurbishment Hubs",
        content: "These state-of-the-art facilities, managed by Ekart, are the engine of our value chain. By centralizing operations, we achieve economies of scale and quality control impossible in the fragmented informal market. Using a lean, multi-stage process, we maximize the value recovered from every item through full refurbishment, component harvesting for a B2B parts market, and certified materials recycling."
    },
    "pillar-3": {
        title: "Pillar 3: 'Flipkart Renew' Marketplace",
        content: "This pillar closes the loop by monetizing the refurbished assets. 'Flipkart Renew' will be a dedicated, high-trust marketplace on the main Flipkart platform. Every product comes with a 'Flipkart Certified' promise, backed by a rigorous multi-point inspection and a comprehensive warranty. This overcomes consumer trust barriers and captures the high-margin potential (10-20%) of the recommerce market."
    }
};

const WORKFLOW_DATA = {
    1: { title: "Stage 1: Receiving & Triage", content: "Devices arrive from customers via Ekart. Each item is scanned, logged in the Hub Management System (HMS), and given an initial visual inspection to determine its potential path: full refurbishment, parts harvesting, or recycling." },
    2: { title: "Stage 2: Secure Data Sanitization", content: "A critical, non-negotiable step. Devices enter a secure zone where certified software performs a multi-pass wipe of all storage, ensuring irreversible data destruction and providing the customer with an auditable certificate for peace of mind." },
    3: { title: "Stage 3: Automated Diagnostics & Grading", content: "AI-powered platforms run a comprehensive suite of tests on all hardware functions (battery, screen, camera, etc.). Machine learning algorithms scan for cosmetic defects, ensuring objective, consistent, and scalable grading." },
    4: { title: "Stage 4: Refurbishment & Repair", content: "Skilled technicians in specialized product 'cells' perform necessary repairs, from cosmetic buffing to complex component-level soldering. Harvested parts are prioritized to reduce costs and improve sustainability." },
    5: { title: "Stage 5: Quality Assurance (QA)", content: "Post-repair, a separate QA team conducts a final multi-point inspection, rerunning key diagnostic tests to ensure every device meets the stringent 'Flipkart Certified' standard for its assigned grade." },
    6: { title: "Stage 6: Kitting & Packaging", content: "Passed devices are professionally cleaned and kitted with necessary accessories (e.g., a high-quality compatible charger). They are then placed in premium, sustainable 'Flipkart Renew' branded packaging." },
    7: { title: "Stage 7: Inventory & Dispatch", content: "The final product is assigned a new SKU, entered into the inventory system, and dispatched to a Flipkart fulfillment center, ready to be listed for sale on the 'Flipkart Renew' marketplace." }
};

const COMPETITOR_DATA = {
    prithvi: {
        name: "Project Prithvi",
        features: {
            "Supply Chain Control": "Excellent", "Quality Assurance": "Excellent", "Customer Trust & Warranty": "Excellent",
            "Scale & Logistics": "Excellent", "EPR Compliance": "Excellent", "Customer Lock-in": "Excellent"
        }
    },
    amazon: {
        name: "Amazon Renewed",
        features: {
            "Supply Chain Control": "Poor (Relies on 3rd parties)", "Quality Assurance": "Variable (Seller-dependent)", "Customer Trust & Warranty": "Fair (A-to-z Guarantee)",
            "Scale & Logistics": "Good (Leverages FBA)", "EPR Compliance": "Challenging (Hard to manage)", "Customer Lock-in": "Low (Standard trade-in)"
        }
    },
    specialists: {
        name: "Specialists (e.g., Cashify)",
        features: {
            "Supply Chain Control": "Good (Direct but limited scale)", "Quality Assurance": "Good (Standardized but less scale)", "Customer Trust & Warranty": "Good (Brand-specific warranty)",
            "Scale & Logistics": "Fair (Limited network)", "EPR Compliance": "Good (Within own ops)", "Customer Lock-in": "Low (Easy to switch)"
        }
    },
    informal: {
        name: "Informal Sector",
        features: {
            "Supply Chain Control": "Poor (Fragmented)", "Quality Assurance": "Very Poor (No standards)", "Customer Trust & Warranty": "None",
            "Scale & Logistics": "Poor (Hyper-local)", "EPR Compliance": "Non-existent", "Customer Lock-in": "None"
        }
    }
};

// --- Reusable Chart Component ---
const ChartComponent = ({ chartId, type, data, options }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        const canvas = document.getElementById(chartId);
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (chartRef.current) {
            chartRef.current.destroy();
        }

        chartRef.current = new Chart(ctx, { type, data, options });

        return () => chartRef.current?.destroy();
    }, [chartId, type, data, options]);

    return (
        <div className="relative h-[30vh] md:h-[40vh] w-full max-w-4xl mx-auto">
            <canvas id={chartId}></canvas>
        </div>
    );
};

// --- Section Components ---
const Header = ({ activeSection, setActiveSection }) => {
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navLinks = ["overview", "market", "solution", "operations", "financials", "competition", "roadmap"];

    useEffect(() => {
        const handleScroll = () => {
            const currentSection = navLinks.find(id => {
                const section = document.getElementById(id);
                if (!section) return false;
                const rect = section.getBoundingClientRect();
                return rect.top <= 80 && rect.bottom >= 80;
            });
            if (currentSection) {
                setActiveSection(currentSection);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [setActiveSection]);

    const NavLink = ({ id, name }) => (
        <a
            href={`#${id}`}
            onClick={() => setMobileMenuOpen(false)}
            className={`capitalize px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${activeSection === id ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-200'}`}
        >
            {name}
        </a>
    );

    return (
        <header className="bg-stone-100/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
            <nav className="px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <a href="#overview" className="flex items-center text-xl md:text-2xl font-extrabold text-stone-800">
                        <FlipkartLogo />
                        <span className="pl-25 font-bold text-blue-600">Project Prithvi</span>
                    </a>
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-2">
                            {navLinks.map(link => <NavLink key={link} id={link} name={link} />)}
                        </div>
                    </div>
                    <div className="md:hidden">
                        <button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-200 focus:outline-none">
                            <span className="sr-only">Open main menu</span>
                            <div className="block h-6 w-6">
                                <span className={`block w-full h-0.5 bg-current transform transition duration-200 ease-in-out ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : '-translate-y-1.5'}`}></span>
                                <span className={`block w-full h-0.5 bg-current transform transition duration-200 ease-in-out ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
                                <span className={`block w-full h-0.5 bg-current transform transition duration-200 ease-in-out ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : 'translate-y-1.5'}`}></span>
                            </div>
                        </button>
                    </div>
                </div>
                {isMobileMenuOpen && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            {navLinks.map(link => (
                                <a key={link} href={`#${link}`} onClick={() => setMobileMenuOpen(false)} className={`capitalize block px-3 py-2 rounded-md text-base font-medium ${activeSection === link ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-blue-100'}`}>{link}</a>
                            ))}
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
};

const OverviewSection = () => (
    <section id="overview" className="text-center py-12 md:py-16">
        <h1 className="text-3xl md:text-6xl font-extrabold tracking-tight text-stone-800">
            The <span className="text-green-600">Cost-Negative</span><br/> Circular Supply Chain
        </h1>
        <p className="mt-4 max-w-3xl mx-auto text-base md:text-xl text-stone-600">Project Prithvi is a "Blue Ocean" strategy to transform e-waste liabilities into a high-margin profit engine, establishing Flipkart as India's leader in sustainable commerce.</p>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-md"><p className="text-3xl md:text-4xl font-bold text-orange-500">40%</p><p className="mt-2 text-stone-600 font-medium">Reduction in Reverse Logistics Costs</p></div>
            <div className="bg-white p-6 rounded-xl shadow-md"><p className="text-3xl md:text-4xl font-bold text-green-600">$52B+</p><p className="mt-2 text-stone-600 font-medium">Recommerce Market by 2035</p></div>
            <div className="bg-white p-6 rounded-xl shadow-md"><p className="text-3xl md:text-4xl font-bold text-blue-500">3-4 Years</p><p className="mt-2 text-stone-600 font-medium">To Achieve Cost-Negativity</p></div>
        </div>
    </section>
);

const MarketSection = () => {
    const marketChartData = {
        labels: ['2024', '2025', '2030', '2033', '2035'],
        datasets: [{ label: 'E-Waste Generated (Million Metric Tons)', data: [1.40, 5.20, 14.00, null, null], borderColor: '#F97316', backgroundColor: '#F97316', yAxisID: 'y', tension: 0.1 }, { label: 'Refurbished Electronics Market (USD Billion)', data: [12.46, 14.20, 27.65, 42.10, 52.25], borderColor: '#16A34A', backgroundColor: '#16A34A', yAxisID: 'y1', tension: 0.1 }]
    };
    const marketChartOptions = { responsive: true, maintainAspectRatio: false, interaction: { mode: 'index', intersect: false }, scales: { y: { type: 'linear', display: true, position: 'left', title: { display: true, text: 'Million Metric Tons', color: '#F97316' } }, y1: { type: 'linear', display: true, position: 'right', title: { display: true, text: 'USD Billion', color: '#16A34A' }, grid: { drawOnChartArea: false } } }, plugins: { tooltip: { callbacks: { label: (c) => `${c.dataset.label}: ${c.parsed.y} ${c.dataset.yAxisID === 'y' ? 'MMT' : 'B USD'}` } } } };
    return (<section id="market" className="py-12 md:py-16"><div className="text-center"><h2 className="text-2xl md:text-4xl font-bold text-stone-800">India's Twin Forces: Crisis & Opportunity</h2><p className="mt-4 max-w-3xl mx-auto text-base md:text-lg text-stone-600">This section visualizes the diverging trends of a growing e-waste crisis and an exploding recommerce market, creating a multi-billion dollar imperative for action.</p></div><div className="mt-12 bg-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-lg"><ChartComponent chartId="marketChart" type="line" data={marketChartData} options={marketChartOptions} /></div></section>);
};

const SolutionSection = () => {
    const [activePillar, setActivePillar] = useState('pillar-1');
    return (<section id="solution" className="py-12 md:py-16"><div className="text-center"><h2 className="text-2xl md:text-4xl font-bold text-stone-800">The Solution: A Virtuous Cycle</h2><p className="mt-4 max-w-3xl mx-auto text-base md:text-lg text-stone-600">Project Prithvi is built on three interconnected pillars that create a self-reinforcing flywheel. Click on each pillar to explore its role.</p></div><div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start"><div className="lg:col-span-1 flex flex-col space-y-6"><div onClick={() => setActivePillar('pillar-1')} className={`cursor-pointer bg-white p-6 rounded-xl shadow-md border-2 transition-all duration-300 transform hover:-translate-y-1 ${activePillar === 'pillar-1' ? 'border-green-500 shadow-lg' : 'border-transparent'}`}><h3 className="text-xl font-bold text-green-700">1. "Green Tag" Buy-Back</h3><p className="mt-2 text-stone-600">Securing a predictable supply of high-quality used devices directly from customers.</p></div><div onClick={() => setActivePillar('pillar-2')} className={`cursor-pointer bg-white p-6 rounded-xl shadow-md border-2 transition-all duration-300 transform hover:-translate-y-1 ${activePillar === 'pillar-2' ? 'border-orange-500 shadow-lg' : 'border-transparent'}`}><h3 className="text-xl font-bold text-orange-600">2. Centralized Hubs</h3><p className="mt-2 text-stone-600">Maximizing value extraction from every device through refurbishment and harvesting.</p></div><div onClick={() => setActivePillar('pillar-3')} className={`cursor-pointer bg-white p-6 rounded-xl shadow-md border-2 transition-all duration-300 transform hover:-translate-y-1 ${activePillar === 'pillar-3' ? 'border-blue-500 shadow-lg' : 'border-transparent'}`}><h3 className="text-xl font-bold text-blue-600">3. 'Flipkart Renew'</h3><p className="mt-2 text-stone-600">Monetizing assets through a trusted, high-margin marketplace.</p></div></div><div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-lg min-h-[300px]"><h3 className="text-2xl font-bold text-stone-800">{activePillar ? PILLAR_DATA[activePillar].title : 'Select a Pillar'}</h3><p className="mt-4 text-stone-600">{activePillar ? PILLAR_DATA[activePillar].content : 'Click on one of the three pillars to the left to see detailed information.'}</p></div></div></section>);
};

const OperationsSection = () => {
    const [activeStage, setActiveStage] = useState('1');
    return (<section id="operations" className="py-12 md:py-16"><div className="text-center"><h2 className="text-2xl md:text-4xl font-bold text-stone-800">The Engine Room: Operational Blueprint</h2><p className="mt-4 max-w-3xl mx-auto text-base md:text-lg text-stone-600">A meticulously designed workflow transforms used devices into high-value "Flipkart Certified" assets. Click each stage to understand the process.</p></div><div className="mt-12"><div className="flex flex-wrap justify-center gap-2 md:gap-4">{Object.keys(WORKFLOW_DATA).map(stageKey => (<button key={stageKey} onClick={() => setActiveStage(stageKey)} className={`flex-grow md:flex-grow-0 text-center px-4 py-2 rounded-full shadow-sm font-semibold transition-colors duration-300 transform hover:-translate-y-1 ${activeStage === stageKey ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>{stageKey}. {WORKFLOW_DATA[stageKey].title.split(':')[1].trim().split(' ')[0]}</button>))}</div><div className="mt-8 bg-white p-8 rounded-2xl shadow-lg"><h3 className="text-xl md:text-2xl font-bold text-stone-800">{activeStage ? WORKFLOW_DATA[activeStage].title : 'Select a Stage'}</h3><p className="mt-4 text-stone-600">{activeStage ? WORKFLOW_DATA[activeStage].content : 'Click on a stage in the workflow above to see a detailed description.'}</p></div></div></section>);
};

const FinancialsSection = () => {
    const financialsChartData = {
        labels: ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'],
        datasets: [{ label: "'Flipkart Renew' Revenue", data: [100, 400, 1000, 2000, 3500], backgroundColor: '#16A34A', order: 2 }, { label: 'Total Operational Cost', data: [75, 200, 450, 700, 1100], backgroundColor: '#F97316', order: 2 }, { label: 'Net Profit / (Loss)', data: [-10, 18, 30, 180, 350], borderColor: '#0284C7', backgroundColor: '#0284C7', type: 'line', order: 1, tension: 0.1 }]
    };
    const financialsChartOptions = { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, title: { display: true, text: 'Amount (in INR Crore)' } } }, plugins: { tooltip: { callbacks: { label: (c) => `${c.dataset.label}: ${c.formattedValue} Cr` } } } };
    return (<section id="financials" className="py-12 md:py-16"><div className="text-center"><h2 className="text-2xl md:text-4xl font-bold text-stone-800">The Path to Profitability</h2><p className="mt-4 max-w-3xl mx-auto text-base md:text-lg text-stone-600">This financial model projects a clear journey from initial investment to a highly profitable, cost-negative state, driven by both cost savings and new, high-margin revenue.</p></div><div className="mt-12 bg-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-lg"><ChartComponent chartId="financialsChart" type="bar" data={financialsChartData} options={financialsChartOptions} /></div></section>);
};

const CompetitionSection = () => {
    const [activeCompetitor, setActiveCompetitor] = useState('amazon');
    const competitor = COMPETITOR_DATA[activeCompetitor];
    const prithvi = COMPETITOR_DATA.prithvi;
    return (<section id="competition" className="py-12 md:py-16"><div className="text-center"><h2 className="text-2xl md:text-4xl font-bold text-stone-800">Building a Defensible Moat</h2><p className="mt-4 max-w-3xl mx-auto text-base md:text-lg text-stone-600">Project Prithvi's vertically integrated model creates a superior value proposition that is difficult to replicate. Select a competitor to see a direct comparison.</p></div><div className="mt-12"><div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4 mb-8">{Object.keys(COMPETITOR_DATA).filter(k => k !== 'prithvi').map(key => (<button key={key} onClick={() => setActiveCompetitor(key)} className={`px-5 py-2 rounded-full font-semibold transition-colors duration-300 transform hover:-translate-y-1 ${activeCompetitor === key ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>{COMPETITOR_DATA[key].name}</button>))}</div><div className="grid grid-cols-1 lg:grid-cols-3 gap-6"><div className="bg-green-50 p-6 rounded-xl border-2 border-green-200"><h3 className="text-xl font-bold text-green-800">{prithvi.name}</h3><ul className="mt-4 space-y-3 text-stone-700">{Object.entries(prithvi.features).map(([key, value]) => (<li key={key}><span className="font-semibold">{key}:</span> {value}</li>))}</ul></div><div className="bg-white p-6 rounded-xl shadow-md col-span-1 lg:col-span-2"><h3 className="text-xl font-bold text-stone-800">{competitor.name}</h3><ul className="mt-4 space-y-3 text-stone-700">{Object.entries(competitor.features).map(([key, value]) => (<li key={key}><span className="font-semibold">{key}:</span> {value}</li>))}</ul></div></div></div></section>);
};

const RoadmapSection = () => (
    <section id="roadmap" className="py-12 md:py-16">
        <div className="text-center"><h2 className="text-2xl md:text-4xl font-bold text-stone-800">Roadmap to Reality</h2><p className="mt-4 max-w-3xl mx-auto text-base md:text-lg text-stone-600">A disciplined, three-phase implementation ensures a de-risked and scalable rollout, progressing from a controlled pilot to a full-scale, pan-India operation.</p></div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md transform hover:-translate-y-1 transition-transform duration-300"><span className="text-sm font-bold text-orange-500">PHASE 1 (Months 0-6)</span><h3 className="mt-2 text-xl font-bold text-stone-800">Pilot & Foundation</h3><ul className="mt-4 space-y-2 text-stone-600 list-disc list-inside"><li>Launch in 2-3 Tier-1 cities</li><li>Focus on smartphones</li><li>Establish first Refurbishment Hub</li><li>Validate unit economics</li></ul></div>
            <div className="bg-white p-6 rounded-xl shadow-md transform hover:-translate-y-1 transition-transform duration-300"><span className="text-sm font-bold text-blue-500">PHASE 2 (Months 6-18)</span><h3 className="mt-2 text-xl font-bold text-stone-800">Metro Expansion</h3><ul className="mt-4 space-y-2 text-stone-600 list-disc list-inside"><li>Expand to all major metros</li><li>Add laptops, tablets, wearables</li><li>Scale to 3 regional Hubs</li><li>Achieve operational profitability</li></ul></div>
            <div className="bg-white p-6 rounded-xl shadow-md transform hover:-translate-y-1 transition-transform duration-300"><span className="text-sm font-bold text-green-600">PHASE 3 (Months 18-36)</span><h3 className="mt-2 text-xl font-bold text-stone-800">National Rollout</h3><ul className="mt-4 space-y-2 text-stone-600 list-disc list-inside"><li>Pan-India coverage</li><li>Introduce large appliances</li><li>Full-scale national marketing</li><li>Cement market leadership</li></ul></div>
        </div>
    </section>
);

const Footer = () => (
    <footer className="bg-stone-800 text-stone-300">
        <div className="px-4 sm:px-6 lg:px-8 py-6 text-center">
            <p>&copy; 2025 Project Prithvi Strategic Proposal. All Rights Reserved.</p>
        </div>
    </footer>
);

// --- Main App Component ---
function App() {
    const [activeSection, setActiveSection] = useState('overview');

    return (
        <div className="bg-stone-50 text-stone-800 antialiased" style={{ fontFamily: "'Inter', sans-serif" }}>
            <Header activeSection={activeSection} setActiveSection={setActiveSection} />
            <main className="px-4 sm:px-6 lg:px-8">
                <OverviewSection />
                <MarketSection />
                <SolutionSection />
                <OperationsSection />
                <FinancialsSection />
                <CompetitionSection />
                <RoadmapSection />
            </main>
            <Footer />
        </div>
    );
}

export default App;
