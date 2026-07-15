import os, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'campus_sarthi.settings')
django.setup()
from resources.models import Resource

RESOURCES = [
  # ── CSE ──────────────────────────────────────────────────────────
  ("DSA Complete Roadmap","End-to-end roadmap covering arrays, linked lists, trees, graphs, and dynamic programming.","CSE","https://roadmap.sh/computer-science","Beginner","DSA,Arrays,Trees,Graphs","Roadmap"),
  ("C++ Interview Preparation","Top C++ concepts and coding patterns asked in product-based company interviews.","CSE","https://www.geeksforgeeks.org/c-plus-plus/","Intermediate","C++,OOP,STL,Interview","Notes"),
  ("Java Interview Preparation","Java OOPS, Collections, Multithreading, and Spring Boot interview Q&A.","CSE","https://www.geeksforgeeks.org/java/","Intermediate","Java,Spring,Collections,Interview","Notes"),
  ("Python Interview Preparation","Python fundamentals, decorators, generators, and coding interview problems.","CSE","https://realpython.com/","Intermediate","Python,Interview,Coding","Notes"),
  ("Operating Systems Notes","Process management, memory management, scheduling, and deadlocks explained.","CSE","https://www.geeksforgeeks.org/operating-systems/","Intermediate","OS,Process,Memory,Scheduling","PDF"),
  ("DBMS Complete Guide","ER diagrams, normalization, SQL queries, transactions, and indexing.","CSE","https://www.geeksforgeeks.org/dbms/","Intermediate","DBMS,SQL,Normalization,ER","Notes"),
  ("Computer Networks","OSI model, TCP/IP, protocols, routing, and network security basics.","CSE","https://www.geeksforgeeks.org/computer-network-tutorials/","Intermediate","Networks,OSI,TCP,Routing","Notes"),
  ("OOP Concepts","Encapsulation, Inheritance, Polymorphism, Abstraction with real examples.","CSE","https://www.geeksforgeeks.org/object-oriented-programming-oops-concept-in-java/","Beginner","OOP,Classes,Inheritance","Notes"),
  ("System Design Basics","Load balancers, caching, databases, microservices, and scalability patterns.","CSE","https://github.com/donnemartin/system-design-primer","Advanced","SystemDesign,Microservices,Scalability","Roadmap"),
  ("SQL Practice Sets","50+ SQL problems from basic SELECT to complex joins and window functions.","CSE","https://leetcode.com/problemset/database/","Intermediate","SQL,Database,Queries","Practice Set"),
  ("Competitive Programming Guide","ICPC, Codeforces, and LeetCode strategies with topic-wise problem sets.","CSE","https://cp-algorithms.com/","Advanced","CP,Algorithms,LeetCode","Roadmap"),

  # ── Cyber Security ───────────────────────────────────────────────
  ("Network Security Fundamentals","Firewalls, IDS/IPS, VPN, and network attack mitigation techniques.","CyberSecurity","https://www.cybrary.it/course/network-security/","Beginner","Network,Firewall,IDS,VPN","Notes"),
  ("Ethical Hacking Roadmap","Complete roadmap from networking basics to advanced exploitation techniques.","CyberSecurity","https://roadmap.sh/cyber-security","Beginner","EthicalHacking,Roadmap,Penetration","Roadmap"),
  ("Penetration Testing Guide","Kali Linux, Metasploit, Burp Suite, and common pentest methodologies.","CyberSecurity","https://www.offensive-security.com/metasploit-unleashed/","Advanced","PenTest,Kali,Metasploit","PDF"),
  ("Web Security & OWASP Top 10","SQL injection, XSS, CSRF, broken auth, and OWASP remediation techniques.","CyberSecurity","https://owasp.org/www-project-top-ten/","Intermediate","OWASP,WebSecurity,XSS,SQLi","Notes"),
  ("Linux for Security","Essential Linux commands, file permissions, bash scripting for security ops.","CyberSecurity","https://linuxjourney.com/","Beginner","Linux,Bash,Security","Notes"),
  ("Digital Forensics Basics","Evidence collection, disk imaging, file recovery, and forensic tools.","CyberSecurity","https://www.sans.org/blog/digital-forensics/","Intermediate","Forensics,Evidence,Tools","PDF"),
  ("Threat Intelligence","CTI lifecycle, STIX/TAXII, threat feeds, and threat actor profiling.","CyberSecurity","https://www.recordedfuture.com/threat-intelligence","Advanced","CTI,ThreatIntel,STIX","Notes"),
  ("Incident Response Playbook","IR phases: preparation, detection, containment, eradication, and recovery.","CyberSecurity","https://www.sans.org/white-papers/","Intermediate","IncidentResponse,IR,SANS","PDF"),
  ("Malware Analysis Basics","Static and dynamic analysis, sandbox tools, and reverse engineering basics.","CyberSecurity","https://malwareunicorn.org/","Advanced","Malware,ReverseEngineering,Analysis","Notes"),
  ("SIEM Fundamentals","Splunk, IBM QRadar, and log correlation for security monitoring.","CyberSecurity","https://www.splunk.com/en_us/training.html","Intermediate","SIEM,Splunk,Logs","Notes"),
  ("SOC Analyst Preparation","Tier 1/2/3 SOC roles, alert triage, playbooks, and SOC tools.","CyberSecurity","https://www.cybrary.it/course/soc-analyst/","Intermediate","SOC,Analyst,Triage","Roadmap"),
  ("Bug Bounty Basics","HackerOne, Bugcrowd, recon methodology, and writing impactful reports.","CyberSecurity","https://www.hackerone.com/resources/hackerone/getting-started-bug-bounty","Beginner","BugBounty,HackerOne,Recon","Notes"),
  ("Cyber Laws & Compliance","IT Act 2000, GDPR, ISO 27001, and compliance frameworks.","CyberSecurity","https://www.meity.gov.in/content/information-technology-act","Beginner","CyberLaw,GDPR,Compliance","PDF"),
  ("Cryptography Essentials","Symmetric, asymmetric, hashing, PKI, and real-world crypto use cases.","CyberSecurity","https://www.coursera.org/learn/crypto","Intermediate","Cryptography,PKI,Hashing","Notes"),

  # ── AI / ML ──────────────────────────────────────────────────────
  ("Python for AI","NumPy, Pandas, Matplotlib, and Scikit-learn for AI/ML development.","AI_ML","https://realpython.com/python-ai-overview/","Beginner","Python,NumPy,Pandas,AI","Notes"),
  ("Machine Learning Basics","Supervised, unsupervised, regression, classification, and model evaluation.","AI_ML","https://www.coursera.org/learn/machine-learning","Beginner","ML,Regression,Classification","Video"),
  ("Deep Learning Fundamentals","Backpropagation, CNNs, RNNs, LSTMs, and training strategies.","AI_ML","https://www.deeplearning.ai/","Intermediate","DeepLearning,CNN,RNN,LSTM","Video"),
  ("Neural Networks Guide","Perceptrons, activation functions, optimizers, and neural architecture design.","AI_ML","https://neuralnetworksanddeeplearning.com/","Intermediate","NeuralNetworks,Perceptron,Optimizer","Notes"),
  ("TensorFlow Crash Course","Building and training models with TensorFlow 2.x and Keras.","AI_ML","https://www.tensorflow.org/tutorials","Intermediate","TensorFlow,Keras,Training","Video"),
  ("PyTorch for Beginners","Tensors, autograd, custom datasets, and model training with PyTorch.","AI_ML","https://pytorch.org/tutorials/","Intermediate","PyTorch,Tensors,Training","Notes"),
  ("NLP Fundamentals","Tokenization, embeddings, transformers, BERT, and GPT basics.","AI_ML","https://huggingface.co/learn/nlp-course/","Advanced","NLP,BERT,Transformers,GPT","Notes"),
  ("Computer Vision Basics","Image processing, CNNs, object detection, and OpenCV.","AI_ML","https://opencv.org/courses/","Intermediate","ComputerVision,CNN,OpenCV","Notes"),
  ("MLOps Basics","Model versioning, CI/CD for ML, MLflow, and production deployment.","AI_ML","https://ml-ops.org/","Advanced","MLOps,MLflow,Deployment","Roadmap"),
  ("AI Interview Questions","Top 100 AI/ML interview Q&A for product and research roles.","AI_ML","https://www.interviewbit.com/machine-learning-interview-questions/","Intermediate","AI,ML,Interview,Questions","Practice Set"),

  # ── Data Science ─────────────────────────────────────────────────
  ("Statistics for Data Science","Descriptive stats, hypothesis testing, distributions, and p-values.","DataScience","https://www.khanacademy.org/math/statistics-probability","Beginner","Statistics,Probability,DataScience","Notes"),
  ("Probability Concepts","Bayes theorem, combinatorics, and probability distributions.","DataScience","https://brilliant.org/courses/probability/","Beginner","Probability,Bayes,Distributions","Notes"),
  ("Data Analysis with Pandas","DataFrames, groupby, merging, and advanced data manipulation.","DataScience","https://pandas.pydata.org/docs/getting_started/","Intermediate","Pandas,DataAnalysis,Python","Notes"),
  ("NumPy Essentials","Arrays, broadcasting, linear algebra, and performance tips.","DataScience","https://numpy.org/learn/","Beginner","NumPy,Arrays,LinearAlgebra","Notes"),
  ("Data Visualization Guide","Matplotlib, Seaborn, and Plotly for impactful charts and dashboards.","DataScience","https://matplotlib.org/stable/tutorials/","Intermediate","Visualization,Matplotlib,Seaborn","Notes"),
  ("SQL for Data Science","Window functions, CTEs, subqueries, and analytical SQL.","DataScience","https://mode.com/sql-tutorial/","Intermediate","SQL,Analytics,WindowFunctions","Practice Set"),
  ("Power BI Basics","Reports, DAX formulas, data modeling, and interactive dashboards.","DataScience","https://learn.microsoft.com/en-us/power-bi/","Beginner","PowerBI,DAX,Dashboard","Video"),
  ("Tableau Fundamentals","Connecting data sources, charts, calculated fields, and storytelling.","DataScience","https://www.tableau.com/learn/training","Beginner","Tableau,Visualization,Dashboard","Video"),
  ("Data Science Interview Prep","Statistics, ML, SQL, and case study questions with model answers.","DataScience","https://www.interviewbit.com/data-science-interview-questions/","Intermediate","DataScience,Interview,CaseStudy","Practice Set"),

  # ── ECE ──────────────────────────────────────────────────────────
  ("Digital Electronics","Logic gates, flip-flops, counters, and combinational circuits.","ECE","https://www.geeksforgeeks.org/digital-electronics-logic-design-tutorials/","Beginner","Digital,LogicGates,Circuits","Notes"),
  ("Analog Electronics","BJTs, MOSFETs, op-amps, and amplifier design fundamentals.","ECE","https://www.allaboutcircuits.com/textbook/","Intermediate","Analog,BJT,OpAmp","Notes"),
  ("Microprocessors & Controllers","8085, 8086, ARM architecture, and embedded programming.","ECE","https://www.geeksforgeeks.org/microprocessor-tutorials/","Intermediate","Microprocessor,8085,ARM","Notes"),
  ("Embedded Systems Basics","GPIO, UART, SPI, I2C, and real-time OS concepts.","ECE","https://www.embedded.com/","Intermediate","Embedded,GPIO,RTOS","Notes"),
  ("VLSI Design Basics","CMOS logic, layout design, timing analysis, and EDA tools.","ECE","https://www.vlsisystemdesign.com/","Advanced","VLSI,CMOS,EDA","PDF"),
  ("Communication Systems","AM/FM, digital modulation, OFDM, and channel capacity.","ECE","https://www.sciencedirect.com/topics/engineering/communication-system","Intermediate","Communication,Modulation,OFDM","Notes"),
  ("Signal Processing","Fourier transform, filters, convolution, and DSP algorithms.","ECE","https://www.dsprelated.com/","Advanced","DSP,Fourier,Filters","Notes"),

  # ── EE ───────────────────────────────────────────────────────────
  ("Power Systems Analysis","Load flow, fault analysis, protection schemes, and power grids.","EE","https://www.geeksforgeeks.org/power-systems/","Intermediate","PowerSystems,LoadFlow,Protection","Notes"),
  ("Electrical Machines","DC motors, induction motors, transformers, and synchronous machines.","EE","https://www.electrical4u.com/","Intermediate","Machines,Motor,Transformer","Notes"),
  ("Control Systems","Transfer functions, Bode plots, root locus, and PID control.","EE","https://www.tutorialspoint.com/control_systems/","Intermediate","ControlSystems,PID,BodePlot","Notes"),
  ("Electrical Measurements","Bridges, instruments, transducers, and error analysis.","EE","https://www.electrical4u.com/electrical-measuring-instruments/","Beginner","Measurements,Instruments","Notes"),
  ("Circuit Theory Basics","KVL, KCL, Thevenin, Norton, and AC circuit analysis.","EE","https://www.allaboutcircuits.com/textbook/","Beginner","Circuits,KVL,Thevenin","Notes"),
  ("Renewable Energy Systems","Solar PV, wind energy, energy storage, and grid integration.","EE","https://www.irena.org/publications","Intermediate","Renewable,Solar,Wind","PDF"),

  # ── Mechanical ───────────────────────────────────────────────────
  ("Thermodynamics Notes","Laws of thermodynamics, cycles, heat engines, and refrigeration.","Mechanical","https://www.geeksforgeeks.org/engineering-thermodynamics/","Intermediate","Thermodynamics,Cycles,Heat","Notes"),
  ("Strength of Materials","Stress, strain, bending, shear force, and deflection analysis.","Mechanical","https://www.engineeringtoolbox.com/","Intermediate","SOM,Stress,Strain,Bending","Notes"),
  ("Manufacturing Processes","Casting, welding, machining, and forming process fundamentals.","Mechanical","https://www.sciencedirect.com/topics/engineering/manufacturing-process","Intermediate","Manufacturing,Casting,Welding","PDF"),
  ("Fluid Mechanics","Bernoulli, viscosity, pipe flow, turbines, and pumps.","Mechanical","https://www.engineeringtoolbox.com/fluid-mechanics-t_21.html","Intermediate","FluidMechanics,Bernoulli,Flow","Notes"),
  ("CAD/CAM Basics","AutoCAD, SolidWorks, CNC programming, and product design workflow.","Mechanical","https://www.autodesk.com/campaigns/education/students","Beginner","CAD,CAM,SolidWorks,AutoCAD","Video"),
  ("Industrial Engineering","Work study, production planning, inventory management, and lean.","Mechanical","https://www.iise.org/","Intermediate","Industrial,Lean,Production","Notes"),

  # ── Civil ────────────────────────────────────────────────────────
  ("Structural Engineering Basics","Beams, columns, frames, and structural analysis methods.","Civil","https://www.structuralguide.com/","Intermediate","Structural,Beams,Columns","Notes"),
  ("RCC Design Guide","IS code design of slabs, beams, columns, and footings.","Civil","https://www.civilengineeringforum.me/","Advanced","RCC,IS456,Slabs,Footings","PDF"),
  ("Transportation Engineering","Highway design, traffic engineering, pavement, and geometric design.","Civil","https://nptel.ac.in/courses/105/101/105101008/","Intermediate","Transportation,Highway,Traffic","Notes"),
  ("Geotechnical Engineering","Soil classification, bearing capacity, consolidation, and slopes.","Civil","https://www.geoengineer.org/","Intermediate","Geotechnical,Soil,Foundation","Notes"),
  ("Surveying Techniques","Chain, theodolite, total station, GPS, and remote sensing.","Civil","https://www.civilseek.com/surveying/","Beginner","Surveying,GPS,TotalStation","Notes"),
  ("Environmental Engineering","Water treatment, sewage, air pollution, and solid waste management.","Civil","https://nptel.ac.in/courses/105/101/105101082/","Intermediate","Environmental,WaterTreatment,Sewage","Notes"),

  # ── MBA ──────────────────────────────────────────────────────────
  ("Marketing Fundamentals","4Ps, STP, digital marketing, branding, and consumer behavior.","MBA","https://www.coursera.org/specializations/marketing","Beginner","Marketing,4Ps,Branding","Notes"),
  ("HR Management Guide","Recruitment, performance management, compensation, and HR analytics.","MBA","https://www.shrm.org/","Intermediate","HR,Recruitment,Compensation","Notes"),
  ("Financial Management","Time value, NPV, IRR, capital structure, and financial ratios.","MBA","https://www.coursera.org/learn/financial-management","Intermediate","Finance,NPV,IRR,Ratios","Notes"),
  ("Operations Management","Supply chain, capacity planning, quality management, and lean.","MBA","https://www.coursera.org/learn/operations-management","Intermediate","Operations,SupplyChain,Lean","Notes"),
  ("Business Analytics Basics","Excel, regression, clustering, and decision-making analytics.","MBA","https://www.coursera.org/specializations/business-analytics","Intermediate","Analytics,Excel,Regression","Notes"),
  ("Case Study Preparation","Framework for cracking McKinsey, BCG, and Bain-style case interviews.","MBA","https://www.caseinterview.com/","Advanced","CaseStudy,Consulting,MCKinsey","Practice Set"),
  ("Group Discussion Strategies","GD types, structuring arguments, common GD topics, and do's/don'ts.","MBA","https://www.indiabix.com/group-discussion/topics/","Beginner","GD,GroupDiscussion,Communication","Notes"),

  # ── Pharmacy ─────────────────────────────────────────────────────
  ("Pharmacology Notes","Drug mechanisms, pharmacokinetics, pharmacodynamics, and drug classes.","Pharmacy","https://www.pharmacologweekly.com/","Intermediate","Pharmacology,Drugs,Kinetics","Notes"),
  ("Pharmaceutical Chemistry","Drug synthesis, SAR, stereochemistry, and analytical methods.","Pharmacy","https://www.pharmacguideline.com/","Advanced","PharmChem,SAR,Synthesis","PDF"),
  ("Drug Design Basics","Target identification, lead optimization, and QSAR.","Pharmacy","https://www.sciencedirect.com/topics/pharmacology-toxicology-and-pharmaceutical-science/drug-design","Advanced","DrugDesign,QSAR,LeadOptimization","Notes"),
  ("Clinical Pharmacy Guide","Drug therapy monitoring, patient counseling, and adverse effects.","Pharmacy","https://www.accp.com/","Intermediate","ClinicalPharmacy,PatientCare","Notes"),
  ("Hospital Pharmacy Basics","Drug dispensing, formulary management, and hospital drug systems.","Pharmacy","https://www.ashp.org/","Beginner","HospitalPharmacy,Dispensing","Notes"),
  ("Industrial Pharmacy","GMP, quality control, regulatory affairs, and pharmaceutical manufacturing.","Pharmacy","https://www.fda.gov/drugs/pharmaceutical-quality-resources","Advanced","Industrial,GMP,QC,Regulatory","PDF"),

  # ── Aptitude ─────────────────────────────────────────────────────
  ("Quantitative Aptitude Guide","Number system, percentages, ratios, averages, and shortcuts.","Aptitude","https://www.indiabix.com/aptitude/questions-and-answers/","Beginner","Quantitative,Numbers,Percentage","Practice Set"),
  ("Logical Reasoning Sets","Blood relations, seating arrangements, syllogisms, and coding-decoding.","Aptitude","https://www.indiabix.com/logical-reasoning/questions-and-answers/","Beginner","Logical,Reasoning,Puzzles","Practice Set"),
  ("Verbal Ability Practice","Reading comprehension, grammar, fill in the blanks, and vocabulary.","Aptitude","https://www.indiabix.com/verbal-ability/questions-and-answers/","Beginner","Verbal,Grammar,Vocabulary","Practice Set"),
  ("Data Interpretation Sets","Tables, bar charts, pie charts, and line graph DI problems.","Aptitude","https://www.indiabix.com/data-interpretation/questions-and-answers/","Intermediate","DI,DataInterpretation,Charts","Practice Set"),
  ("Number Series Practice","Missing number, wrong term, and pattern-based series questions.","Aptitude","https://www.smartkeeda.com/Aptitude/Number_Series/","Beginner","NumberSeries,Patterns","Practice Set"),
  ("Time & Work Problems","Work and wages, pipes and cisterns with formula-based shortcuts.","Aptitude","https://www.geeksforgeeks.org/time-and-work-aptitude-questions/","Intermediate","TimeWork,Pipes,Shortcuts","Practice Set"),
  ("Profit & Loss Shortcuts","SP, CP, markup, discount, and successive discount quick formulas.","Aptitude","https://www.geeksforgeeks.org/profit-and-loss/","Beginner","ProfitLoss,Discount,Markup","Practice Set"),

  # ── Communication ────────────────────────────────────────────────
  ("HR Interview Preparation","Tell me about yourself, strengths, weaknesses, and situational answers.","Communication","https://www.interviewbit.com/hr-interview-questions/","Beginner","HR,Interview,SoftSkills","Practice Set"),
  ("Resume Building Guide","ATS-friendly resume format, action verbs, and section-wise tips.","Communication","https://resumegenius.com/","Beginner","Resume,ATS,Format","Notes"),
  ("LinkedIn Optimization","Profile headline, about section, skills, and networking strategies.","Communication","https://www.linkedin.com/business/talent/blog/talent-acquisition/tips-for-taking-control-of-your-linkedin-profile","Beginner","LinkedIn,Profile,Networking","Notes"),
  ("Public Speaking Techniques","Structuring speeches, overcoming stage fear, and delivery tips.","Communication","https://www.toastmasters.org/","Beginner","PublicSpeaking,Presentation","Notes"),
  ("Group Discussion Prep","GD strategies, topic lists, and dos and don'ts for MBA/Campus GDs.","Communication","https://www.mbacrystalball.com/gd-topics/","Beginner","GD,GroupDiscussion","Notes"),
  ("Email Writing Guide","Professional email structure, tone, subject lines, and templates.","Communication","https://www.grammarly.com/blog/professional-email-writing-tips/","Beginner","Email,Professional,Writing","Notes"),
  ("Corporate Communication","Workplace communication, meetings, presentations, and office etiquette.","Communication","https://www.coursera.org/learn/communicating-at-work","Intermediate","Corporate,Communication,Workplace","Video"),

  # ── Placement ────────────────────────────────────────────────────
  ("Company-wise Preparation Guide","TCS, Infosys, Wipro, Cognizant, Capgemini, and product company roadmaps.","Placement","https://www.placementpreparation.io/","Intermediate","Companies,TCS,Infosys,Wipro","Roadmap"),
  ("Placement Roadmap 2025","Month-by-month placement preparation plan for final year students.","Placement","https://www.geeksforgeeks.org/placement-preparation-for-freshers/","Beginner","Placement,Roadmap,Freshers","Roadmap"),
  ("Interview Experiences Database","Real interview experiences from students at FAANG and Indian companies.","Placement","https://www.geeksforgeeks.org/category/interview-experiences/","Intermediate","Interview,Experience,FAANG","Notes"),
  ("GD Strategy Guide","Types of GDs, topic analysis, and structured participation techniques.","Placement","https://www.mbacrystalball.com/gd-topics/","Beginner","GD,Strategy,Topics","Notes"),
  ("Mock Interview Resources","Pramp, Interviewing.io, and peer mock interview platforms.","Placement","https://www.pramp.com/","Intermediate","MockInterview,Practice","Notes"),
  ("Off-Campus Preparation","LinkedIn job search, cold emailing, referrals, and hackathon strategy.","Placement","https://www.linkedin.com/jobs/","Intermediate","OffCampus,LinkedIn,Jobs","Notes"),
  ("Internship Preparation Guide","Resume tips, intern interview prep, and top internship platforms.","Placement","https://internshala.com/","Beginner","Internship,Resume,Platforms","Notes"),

  # ── Higher Studies ───────────────────────────────────────────────
  ("GATE CSE Preparation Roadmap","Subject-wise GATE strategy for CS students with important topics.","HigherStudies","https://www.geeksforgeeks.org/gate-cs-notes-gq/","Advanced","GATE,CSE,Preparation","Roadmap"),
  ("GRE Preparation Guide","Quant, Verbal, AWA sections, study plan, and top resources.","HigherStudies","https://www.ets.org/gre/","Advanced","GRE,QuantVerbal,StudyPlan","Notes"),
  ("CAT Preparation Strategy","Quant, VARC, DILR sections with time management and mock tests.","HigherStudies","https://iimcat.ac.in/","Advanced","CAT,MBA,Quant,VARC","Roadmap"),
]

created = skipped = 0
for row in RESOURCES:
    title, desc, cat, url, diff, tags, rtype = row
    _, was_created = Resource.objects.get_or_create(
        title=title,
        defaults=dict(description=desc, category=cat, url=url,
                      difficulty=diff, tags=tags, resource_type=rtype, is_active=True)
    )
    if was_created:
        created += 1
        print(f"  ✓ {title}")
    else:
        skipped += 1
        print(f"  – skip: {title}")

print(f"\nDone. {created} created, {skipped} skipped.")
