// Page Loading Animation
window.addEventListener('load', () => {
    const loader = document.getElementById('pageLoader');
    setTimeout(() => {
        loader.classList.add('fade-out');
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }, 1000);
});

// Progress Bar
window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    document.getElementById('progressBar').style.width = scrolled + '%';
    
    // Show/hide scroll to top button
    const scrollToTopBtn = document.getElementById('scrollToTop');
    if (winScroll > 300) {
        scrollToTopBtn.classList.add('visible');
    } else {
        scrollToTopBtn.classList.remove('visible');
    }
});

// Scroll to Top Button
document.getElementById('scrollToTop').addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Intersection Observer for Animations
const animationObserverOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, animationObserverOptions);

// Observe all elements with animation classes
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in');
    animatedElements.forEach(el => animationObserver.observe(el));
    
    // Initialize click sounds
    if (typeof addClickSounds === 'function') {
        addClickSounds();
    }
});

// Enhanced Navigation Active State
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Smooth Scroll for Navigation Links
document.querySelectorAll('.nav-link, .btn[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Mobile Navigation Toggle
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Translation functionality
const translations = {
    en: {
        'nav-home': 'Home',
        'nav-about': 'About',
        'nav-skills': 'Skills',
        'nav-projects': 'Projects',
        'nav-experience': 'Experience',
        'nav-contact': 'Contact',
        'hero-greeting': 'Hi, I\'m',
        'hero-title': 'Software Developer',
        'hero-description': 'I craft innovative, user-focused software solutions that scale seamlessly and solve real-world problems. Committed to clean, maintainable code, exceptional user experience, and continuous growth as a developer.',
        'btn-work': 'View My Work',
        'btn-contact': 'Get In Touch',
        'about-title': 'About Me',
        'about-text-1': 'I\'m a passionate software developer with expertise in modern web technologies and a strong foundation in computer science principles. I enjoy tackling complex problems and turning ideas into functional, user-friendly applications.',
        'about-text-2': 'My journey in software development has led me to work with various technologies and frameworks, always staying current with industry trends and best practices. I believe in writing clean, maintainable code and creating solutions that make a positive impact.',
        'stat-experience': 'Years Experience',
        'stat-projects': 'Projects Completed',
        'stat-satisfaction': 'Client Satisfaction',
        'skills-title': 'Technical Skills',
        'skill-frontend': 'Frontend Development',
        'skill-backend': 'Backend Development',
        'skill-database': 'Database & Cloud',
        'skill-tools': 'Tools & Other',
        'projects-title': 'Featured Projects',
        'project-vantra-desc': 'An innovative orbital tracking and space management application designed to monitor satellite movements and space debris with real-time data visualization.',
        'project-planora-desc': 'A comprehensive planning and scheduling application that helps users organize their tasks, events, and goals with intelligent automation and intuitive design.',
        'project-hilllife-desc': 'A lifestyle and wellness platform focused on outdoor activities, hiking trails, and community building for outdoor enthusiasts and adventure seekers.',
        'project-sleep-desc': 'A full-featured Sleep Tracker App that helps users monitor their sleep patterns, improve sleep hygiene, and maintain a healthy routine. Built with modern web technologies.',
        'project-dream-desc': 'A cloud-based application layer that provides seamless integration between different software systems with advanced data processing and workflow automation.',
        'project-cd-desc': 'A continuous deployment and continuous integration pipeline solution that streamlines software development workflows with automated testing, building, and deployment processes.',
        'view-code': 'View Code',
        'experience-title': 'Professional Experience',
        'exp-title-1': 'Aspiring Software Developer',
        'exp-subtitle-1': 'Career Transition - Self-Directed Learning',
        'exp-desc-1': 'Currently pursuing a career transition into software development through intensive coding bootcamp and self-directed learning. Building practical projects and developing technical skills.',
        'exp-item-1-1': 'Completed coding bootcamp coursework in web development',
        'exp-item-1-2': 'Built multiple projects including SleepTrackerPro and Task Manager App',
        'exp-item-1-3': 'Learning HTML, CSS, JavaScript, and modern web technologies',
        'exp-item-1-4': 'Developing portfolio projects to demonstrate technical abilities',
        'exp-title-2': 'Fitness Sales Professional',
        'exp-subtitle-2': 'Fitness Industry',
        'exp-desc-2': 'Developed strong communication, problem-solving, and client relationship skills while working in fitness sales. Gained valuable experience in customer service and business development.',
        'exp-item-2-1': 'Built relationships with clients and understood their needs',
        'exp-item-2-2': 'Developed strong communication and presentation skills',
        'exp-item-2-3': 'Learned to work under pressure and meet targets',
        'exp-item-2-4': 'Gained experience in customer service and problem resolution',
        'exp-title-3': 'Technical Learning Journey',
        'exp-subtitle-3': 'Skill Development & Education',
        'exp-desc-3': 'Embarked on an intensive learning journey to transition into software development. Focusing on web technologies and building practical coding skills through hands-on projects.',
        'exp-item-3-1': 'Enrolled in coding bootcamp and online courses',
        'exp-item-3-2': 'Created study guides and learning materials',
        'exp-item-3-3': 'Built functional web applications from scratch',
        'exp-item-3-4': 'Actively seeking opportunities to apply technical skills professionally',
        'contact-title': 'Get In Touch',
        'contact-heading': 'Let\'s Work Together',
        'contact-text': 'I\'m always interested in new opportunities and exciting projects. Whether you\'re looking for a developer to join your team or need help with a specific project, I\'d love to hear from you.',
        'contact-email-label': 'Email',
        'contact-phone-label': 'Phone',
        'contact-location-label': 'Location',
        'form-name': 'Name',
        'form-email': 'Email',
        'form-subject': 'Subject',
        'form-message': 'Message',
        'form-send': 'Send Message',
        'footer-tagline': 'Software Developer passionate about creating innovative solutions.',
        'footer-copyright': '© 2025 O\'Neal Shockley. All rights reserved.'
    },
    es: {
        'nav-home': 'Inicio',
        'nav-about': 'Acerca de',
        'nav-skills': 'Habilidades',
        'nav-projects': 'Proyectos',
        'nav-experience': 'Experiencia',
        'nav-contact': 'Contacto',
        'hero-greeting': 'Hola, soy',
        'hero-title': 'Desarrollador de Software',
        'hero-description': 'Creo soluciones de software innovadoras y centradas en el usuario que escalan perfectamente y resuelven problemas del mundo real. Comprometido con código limpio y mantenible, experiencia de usuario excepcional y crecimiento continuo como desarrollador.',
        'btn-work': 'Ver Mi Trabajo',
        'btn-contact': 'Contactar',
        'about-title': 'Acerca de Mí',
        'about-text-1': 'Soy un desarrollador de software apasionado con experiencia en tecnologías web modernas y una sólida base en principios de ciencias de la computación. Disfruto abordar problemas complejos y convertir ideas en aplicaciones funcionales y fáciles de usar.',
        'about-text-2': 'Mi viaje en el desarrollo de software me ha llevado a trabajar con diversas tecnologías y frameworks, manteniéndome siempre al día con las tendencias de la industria y las mejores prácticas. Creo en escribir código limpio y mantenible y crear soluciones que generen un impacto positivo.',
        'stat-experience': 'Años de Experiencia',
        'stat-projects': 'Proyectos Completados',
        'stat-satisfaction': 'Satisfacción del Cliente',
        'skills-title': 'Habilidades Técnicas',
        'skill-frontend': 'Desarrollo Frontend',
        'skill-backend': 'Desarrollo Backend',
        'skill-database': 'Base de Datos y Nube',
        'skill-tools': 'Herramientas y Otros',
        'projects-title': 'Proyectos Destacados',
        'project-vantra-desc': 'Una aplicación innovadora de seguimiento orbital y gestión espacial diseñada para monitorear movimientos de satélites y desechos espaciales con visualización de datos en tiempo real.',
        'project-planora-desc': 'Una aplicación integral de planificación y programación que ayuda a los usuarios a organizar sus tareas, eventos y objetivos con automatización inteligente y diseño intuitivo.',
        'project-hilllife-desc': 'Una plataforma de estilo de vida y bienestar centrada en actividades al aire libre, senderos de montaña y construcción de comunidad para entusiastas del aire libre y buscadores de aventuras.',
        'project-sleep-desc': 'Una aplicación completa de seguimiento del sueño que ayuda a los usuarios a monitorear sus patrones de sueño, mejorar la higiene del sueño y mantener una rutina saludable. Construida con tecnologías web modernas.',
        'project-dream-desc': 'Una capa de aplicación basada en la nube que proporciona integración perfecta entre diferentes sistemas de software con procesamiento avanzado de datos y automatización de flujos de trabajo.',
        'project-cd-desc': 'Una solución de pipeline de despliegue continuo e integración continua que optimiza los flujos de trabajo de desarrollo de software con pruebas automatizadas, construcción y procesos de despliegue.',
        'view-code': 'Ver Código',
        'experience-title': 'Experiencia Profesional',
        'exp-title-1': 'Aspirante a Desarrollador de Software',
        'exp-subtitle-1': 'Transición Profesional - Aprendizaje Autodirigido',
        'exp-desc-1': 'Actualmente persiguiendo una transición profesional hacia el desarrollo de software a través de bootcamp de programación intensivo y aprendizaje autodirigido. Construyendo proyectos prácticos y desarrollando habilidades técnicas.',
        'exp-item-1-1': 'Completé el curso de bootcamp de programación en desarrollo web',
        'exp-item-1-2': 'Construí múltiples proyectos incluyendo SleepTrackerPro y Task Manager App',
        'exp-item-1-3': 'Aprendiendo HTML, CSS, JavaScript y tecnologías web modernas',
        'exp-item-1-4': 'Desarrollando proyectos de portafolio para demostrar habilidades técnicas',
        'exp-title-2': 'Profesional de Ventas de Fitness',
        'exp-subtitle-2': 'Industria del Fitness',
        'exp-desc-2': 'Desarrollé habilidades sólidas de comunicación, resolución de problemas y relaciones con clientes mientras trabajaba en ventas de fitness. Obtuve experiencia valiosa en servicio al cliente y desarrollo de negocios.',
        'exp-item-2-1': 'Construí relaciones con clientes y entendí sus necesidades',
        'exp-item-2-2': 'Desarrollé habilidades sólidas de comunicación y presentación',
        'exp-item-2-3': 'Aprendí a trabajar bajo presión y cumplir objetivos',
        'exp-item-2-4': 'Obtuve experiencia en servicio al cliente y resolución de problemas',
        'exp-title-3': 'Viaje de Aprendizaje Técnico',
        'exp-subtitle-3': 'Desarrollo de Habilidades y Educación',
        'exp-desc-3': 'Me embarqué en un viaje de aprendizaje intensivo para hacer la transición al desarrollo de software. Enfocándome en tecnologías web y construyendo habilidades de programación práctica a través de proyectos prácticos.',
        'exp-item-3-1': 'Me inscribí en bootcamp de programación y cursos en línea',
        'exp-item-3-2': 'Creé guías de estudio y materiales de aprendizaje',
        'exp-item-3-3': 'Construí aplicaciones web funcionales desde cero',
        'exp-item-3-4': 'Buscando activamente oportunidades para aplicar habilidades técnicas profesionalmente',
        'contact-title': 'Ponte en Contacto',
        'contact-heading': 'Trabajemos Juntos',
        'contact-text': 'Siempre estoy interesado en nuevas oportunidades y proyectos emocionantes. Ya sea que busques un desarrollador para unirse a tu equipo o necesites ayuda con un proyecto específico, me encantaría saber de ti.',
        'contact-email-label': 'Correo Electrónico',
        'contact-phone-label': 'Teléfono',
        'contact-location-label': 'Ubicación',
        'form-name': 'Nombre',
        'form-email': 'Correo Electrónico',
        'form-subject': 'Asunto',
        'form-message': 'Mensaje',
        'form-send': 'Enviar Mensaje',
        'footer-tagline': 'Desarrollador de Software apasionado por crear soluciones innovadoras.',
        'footer-copyright': '© 2025 O\'Neal Shockley. Todos los derechos reservados.'
    },
    zh: {
        'nav-home': '首页',
        'nav-about': '关于',
        'nav-skills': '技能',
        'nav-projects': '项目',
        'nav-experience': '经验',
        'nav-contact': '联系',
        'hero-greeting': '你好，我是',
        'hero-title': '软件开发者',
        'hero-description': '我创建创新的、以用户为中心的软件解决方案，可无缝扩展并解决现实世界的问题。致力于清洁、可维护的代码、卓越的用户体验和作为开发者的持续成长。',
        'btn-work': '查看我的作品',
        'btn-contact': '联系我',
        'about-title': '关于我',
        'about-text-1': '我是一名充满激情的软件开发者，在现代网络技术方面拥有专业知识，并在计算机科学原理方面有着坚实的基础。我喜欢解决复杂问题，将想法转化为功能性、用户友好的应用程序。',
        'about-text-2': '我的软件开发之旅让我接触了各种技术和框架，始终紧跟行业趋势和最佳实践。我相信编写清洁、可维护的代码，创造产生积极影响的解决方案。',
        'stat-experience': '年经验',
        'stat-projects': '完成项目',
        'stat-satisfaction': '客户满意度',
        'skills-title': '技术技能',
        'skill-frontend': '前端开发',
        'skill-backend': '后端开发',
        'skill-database': '数据库和云',
        'skill-tools': '工具和其他',
        'projects-title': '精选项目',
        'project-vantra-desc': '一个创新的轨道跟踪和空间管理应用程序，旨在通过实时数据可视化监控卫星运动和太空碎片。',
        'project-planora-desc': '一个全面的规划和调度应用程序，帮助用户通过智能自动化和直观设计组织他们的任务、事件和目标。',
        'project-hilllife-desc': '一个专注于户外活动、远足径和社区建设的生活方式和健康平台，为户外爱好者和冒险寻求者服务。',
        'project-sleep-desc': '一个功能齐全的睡眠跟踪应用程序，帮助用户监控他们的睡眠模式，改善睡眠卫生，维持健康的例行公事。使用现代网络技术构建。',
        'project-dream-desc': '一个基于云的应用程序层，提供不同软件系统之间的无缝集成，具有先进的数据处理和工作流自动化功能。',
        'project-cd-desc': '一个持续部署和持续集成管道解决方案，通过自动化测试、构建和部署流程简化软件开发工作流。',
        'view-code': '查看代码',
        'experience-title': '专业经验',
        'exp-title-1': '有抱负的软件开发者',
        'exp-subtitle-1': '职业转型 - 自主学习',
        'exp-desc-1': '目前正在通过密集的编程训练营和自主学习追求向软件开发的职业转型。构建实用项目并发展技术技能。',
        'exp-item-1-1': '完成了网络开发编程训练营课程',
        'exp-item-1-2': '构建了多个项目，包括SleepTrackerPro和任务管理应用程序',
        'exp-item-1-3': '学习HTML、CSS、JavaScript和现代网络技术',
        'exp-item-1-4': '开发作品集项目以展示技术能力',
        'exp-title-2': '健身销售专业人员',
        'exp-subtitle-2': '健身行业',
        'exp-desc-2': '在健身销售工作中发展了强大的沟通、问题解决和客户关系技能。在客户服务和业务发展方面获得了宝贵经验。',
        'exp-item-2-1': '与客户建立关系并了解他们的需求',
        'exp-item-2-2': '发展了强大的沟通和演示技能',
        'exp-item-2-3': '学会了在压力下工作并达成目标',
        'exp-item-2-4': '在客户服务和问题解决方面获得经验',
        'exp-title-3': '技术学习之旅',
        'exp-subtitle-3': '技能发展与教育',
        'exp-desc-3': '踏上了向软件开发转型的密集学习之旅。专注于网络技术，通过实际项目构建实用的编程技能。',
        'exp-item-3-1': '参加了编程训练营和在线课程',
        'exp-item-3-2': '创建了学习指南和学习材料',
        'exp-item-3-3': '从头开始构建功能性网络应用程序',
        'exp-item-3-4': '积极寻求机会专业应用技术技能',
        'contact-title': '联系我',
        'contact-heading': '让我们合作',
        'contact-text': '我总是对新的机会和令人兴奋的项目感兴趣。无论您是在寻找开发者加入您的团队，还是需要特定项目的帮助，我都很乐意听到您的消息。',
        'contact-email-label': '电子邮件',
        'contact-phone-label': '电话',
        'contact-location-label': '位置',
        'form-name': '姓名',
        'form-email': '电子邮件',
        'form-subject': '主题',
        'form-message': '消息',
        'form-send': '发送消息',
        'footer-tagline': '热衷于创造创新解决方案的软件开发者。',
        'footer-copyright': '© 2025 O\'Neal Shockley。保留所有权利。'
    },
    de: {
        'nav-home': 'Startseite',
        'nav-about': 'Über mich',
        'nav-skills': 'Fähigkeiten',
        'nav-projects': 'Projekte',
        'nav-experience': 'Erfahrung',
        'nav-contact': 'Kontakt',
        'hero-greeting': 'Hallo, ich bin',
        'hero-title': 'Software-Entwickler',
        'hero-description': 'Ich entwickle innovative, benutzerorientierte Software-Lösungen, die nahtlos skalieren und reale Probleme lösen. Verpflichtet zu sauberem, wartbarem Code, außergewöhnlicher Benutzererfahrung und kontinuierlichem Wachstum als Entwickler.',
        'btn-work': 'Meine Arbeit ansehen',
        'btn-contact': 'Kontakt aufnehmen',
        'about-title': 'Über mich',
        'about-text-1': 'Ich bin ein leidenschaftlicher Software-Entwickler mit Expertise in modernen Web-Technologien und einem starken Fundament in Informatik-Prinzipien. Ich genieße es, komplexe Probleme anzugehen und Ideen in funktionale, benutzerfreundliche Anwendungen zu verwandeln.',
        'about-text-2': 'Meine Reise in der Software-Entwicklung hat mich dazu gebracht, mit verschiedenen Technologien und Frameworks zu arbeiten, immer am Puls der Industrie-Trends und bewährten Praktiken. Ich glaube an das Schreiben von sauberem, wartbarem Code und das Schaffen von Lösungen, die einen positiven Einfluss haben.',
        'stat-experience': 'Jahre Erfahrung',
        'stat-projects': 'Abgeschlossene Projekte',
        'stat-satisfaction': 'Kundenzufriedenheit',
        'skills-title': 'Technische Fähigkeiten',
        'skill-frontend': 'Frontend-Entwicklung',
        'skill-backend': 'Backend-Entwicklung',
        'skill-database': 'Datenbank & Cloud',
        'skill-tools': 'Tools & Andere',
        'projects-title': 'Ausgewählte Projekte',
        'project-vantra-desc': 'Eine innovative Orbital-Tracking- und Weltraum-Management-Anwendung, die darauf ausgelegt ist, Satellitenbewegungen und Weltraummüll mit Echtzeitdatenvisualisierung zu überwachen.',
        'project-planora-desc': 'Eine umfassende Planungs- und Terminplanungsanwendung, die Benutzern hilft, ihre Aufgaben, Ereignisse und Ziele mit intelligenter Automatisierung und intuitivem Design zu organisieren.',
        'project-hilllife-desc': 'Eine Lifestyle- und Wellness-Plattform, die sich auf Outdoor-Aktivitäten, Wanderwege und Gemeinschaftsbildung für Outdoor-Enthusiasten und Abenteurer konzentriert.',
        'project-sleep-desc': 'Eine voll ausgestattete Schlaf-Tracker-App, die Benutzern hilft, ihre Schlafmuster zu überwachen, die Schlafhygiene zu verbessern und eine gesunde Routine aufrechtzuerhalten. Mit modernen Web-Technologien entwickelt.',
        'project-dream-desc': 'Eine cloud-basierte Anwendungsschicht, die nahtlose Integration zwischen verschiedenen Software-Systemen mit fortgeschrittener Datenverarbeitung und Workflow-Automatisierung bietet.',
        'project-cd-desc': 'Eine kontinuierliche Bereitstellungs- und kontinuierliche Integrations-Pipeline-Lösung, die Software-Entwicklungsworkflows mit automatisierten Tests, Build- und Bereitstellungsprozessen optimiert.',
        'view-code': 'Code ansehen',
        'experience-title': 'Berufserfahrung',
        'exp-title-1': 'Angehender Software-Entwickler',
        'exp-subtitle-1': 'Berufswechsel - Selbstgesteuertes Lernen',
        'exp-desc-1': 'Verfolge derzeit einen Berufswechsel in die Software-Entwicklung durch intensives Coding-Bootcamp und selbstgesteuertes Lernen. Baue praktische Projekte auf und entwickle technische Fähigkeiten.',
        'exp-item-1-1': 'Abgeschlossene Coding-Bootcamp-Kurse in Web-Entwicklung',
        'exp-item-1-2': 'Mehrere Projekte erstellt, einschließlich SleepTrackerPro und Task Manager App',
        'exp-item-1-3': 'Lernen von HTML, CSS, JavaScript und modernen Web-Technologien',
        'exp-item-1-4': 'Entwicklung von Portfolio-Projekten zur Demonstration technischer Fähigkeiten',
        'exp-title-2': 'Fitness-Verkaufsprofi',
        'exp-subtitle-2': 'Fitness-Industrie',
        'exp-desc-2': 'Entwickelte starke Kommunikations-, Problemlösungs- und Kundenbeziehungsfähigkeiten während der Arbeit im Fitness-Verkauf. Sammelte wertvolle Erfahrungen im Kundenservice und in der Geschäftsentwicklung.',
        'exp-item-2-1': 'Beziehungen zu Kunden aufgebaut und ihre Bedürfnisse verstanden',
        'exp-item-2-2': 'Starke Kommunikations- und Präsentationsfähigkeiten entwickelt',
        'exp-item-2-3': 'Gelernt, unter Druck zu arbeiten und Ziele zu erreichen',
        'exp-item-2-4': 'Erfahrung im Kundenservice und in der Problemlösung gesammelt',
        'exp-title-3': 'Technische Lernreise',
        'exp-subtitle-3': 'Kompetenzentwicklung & Bildung',
        'exp-desc-3': 'Begann eine intensive Lernreise für den Übergang zur Software-Entwicklung. Fokussierung auf Web-Technologien und Aufbau praktischer Programmierfähigkeiten durch praktische Projekte.',
        'exp-item-3-1': 'In Coding-Bootcamp und Online-Kurse eingeschrieben',
        'exp-item-3-2': 'Studienführer und Lernmaterialien erstellt',
        'exp-item-3-3': 'Funktionale Web-Anwendungen von Grund auf erstellt',
        'exp-item-3-4': 'Aktiv auf der Suche nach Möglichkeiten, technische Fähigkeiten beruflich anzuwenden',
        'contact-title': 'Kontakt aufnehmen',
        'contact-heading': 'Lass uns zusammenarbeiten',
        'contact-text': 'Ich bin immer an neuen Möglichkeiten und aufregenden Projekten interessiert. Egal, ob Sie einen Entwickler für Ihr Team suchen oder Hilfe bei einem bestimmten Projekt benötigen, ich würde gerne von Ihnen hören.',
        'contact-email-label': 'E-Mail',
        'contact-phone-label': 'Telefon',
        'contact-location-label': 'Standort',
        'form-name': 'Name',
        'form-email': 'E-Mail',
        'form-subject': 'Betreff',
        'form-message': 'Nachricht',
        'form-send': 'Nachricht senden',
        'footer-tagline': 'Software-Entwickler mit Leidenschaft für innovative Lösungen.',
        'footer-copyright': '© 2025 O\'Neal Shockley. Alle Rechte vorbehalten.'
    },
    it: {
        'nav-home': 'Home',
        'nav-about': 'Chi sono',
        'nav-skills': 'Competenze',
        'nav-projects': 'Progetti',
        'nav-experience': 'Esperienza',
        'nav-contact': 'Contatti',
        'hero-greeting': 'Ciao, sono',
        'hero-title': 'Sviluppatore Software',
        'hero-description': 'Creo soluzioni software innovative e orientate all\'utente che scalano perfettamente e risolvono problemi del mondo reale. Impegnato per codice pulito e mantenibile, esperienza utente eccezionale e crescita continua come sviluppatore.',
        'btn-work': 'Vedi il mio lavoro',
        'btn-contact': 'Contattami',
        'about-title': 'Chi sono',
        'about-text-1': 'Sono uno sviluppatore software appassionato con competenze nelle tecnologie web moderne e una solida base nei principi dell\'informatica. Mi piace affrontare problemi complessi e trasformare idee in applicazioni funzionali e user-friendly.',
        'about-text-2': 'Il mio percorso nello sviluppo software mi ha portato a lavorare con varie tecnologie e framework, rimanendo sempre aggiornato con le tendenze del settore e le migliori pratiche. Credo nello scrivere codice pulito e mantenibile e nel creare soluzioni che abbiano un impatto positivo.',
        'stat-experience': 'Anni di Esperienza',
        'stat-projects': 'Progetti Completati',
        'stat-satisfaction': 'Soddisfazione Cliente',
        'skills-title': 'Competenze Tecniche',
        'skill-frontend': 'Sviluppo Frontend',
        'skill-backend': 'Sviluppo Backend',
        'skill-database': 'Database e Cloud',
        'skill-tools': 'Strumenti e Altro',
        'projects-title': 'Progetti in Evidenza',
        'project-vantra-desc': 'Un\'applicazione innovativa di tracciamento orbitale e gestione spaziale progettata per monitorare i movimenti dei satelliti e i detriti spaziali con visualizzazione dei dati in tempo reale.',
        'project-planora-desc': 'Un\'applicazione completa di pianificazione e programmazione che aiuta gli utenti a organizzare i loro compiti, eventi e obiettivi con automazione intelligente e design intuitivo.',
        'project-hilllife-desc': 'Una piattaforma di lifestyle e benessere focalizzata su attività all\'aperto, sentieri escursionistici e costruzione di comunità per appassionati di outdoor e cercatori di avventure.',
        'project-sleep-desc': 'Un\'app completa di monitoraggio del sonno che aiuta gli utenti a monitorare i loro pattern di sonno, migliorare l\'igiene del sonno e mantenere una routine salutare. Costruita con tecnologie web moderne.',
        'project-dream-desc': 'Un livello applicativo basato su cloud che fornisce integrazione perfetta tra diversi sistemi software con elaborazione avanzata dei dati e automazione del flusso di lavoro.',
        'project-cd-desc': 'Una soluzione di pipeline di distribuzione continua e integrazione continua che ottimizza i flussi di lavoro di sviluppo software con test automatizzati, build e processi di distribuzione.',
        'view-code': 'Vedi Codice',
        'experience-title': 'Esperienza Professionale',
        'exp-title-1': 'Aspirante Sviluppatore Software',
        'exp-subtitle-1': 'Transizione Professionale - Apprendimento Autodiretto',
        'exp-desc-1': 'Attualmente perseguendo una transizione professionale nello sviluppo software attraverso bootcamp di programmazione intensivo e apprendimento autodiretto. Costruendo progetti pratici e sviluppando competenze tecniche.',
        'exp-item-1-1': 'Completato corso bootcamp di programmazione nello sviluppo web',
        'exp-item-1-2': 'Costruito molteplici progetti inclusi SleepTrackerPro e Task Manager App',
        'exp-item-1-3': 'Apprendimento di HTML, CSS, JavaScript e tecnologie web moderne',
        'exp-item-1-4': 'Sviluppo di progetti portfolio per dimostrare capacità tecniche',
        'exp-title-2': 'Professionista Vendite Fitness',
        'exp-subtitle-2': 'Industria Fitness',
        'exp-desc-2': 'Sviluppato forti competenze di comunicazione, risoluzione problemi e relazioni clienti mentre lavoravo nelle vendite fitness. Acquisito esperienza preziosa nel servizio clienti e sviluppo business.',
        'exp-item-2-1': 'Costruito relazioni con clienti e compreso le loro esigenze',
        'exp-item-2-2': 'Sviluppato forti competenze di comunicazione e presentazione',
        'exp-item-2-3': 'Imparato a lavorare sotto pressione e raggiungere obiettivi',
        'exp-item-2-4': 'Acquisito esperienza nel servizio clienti e risoluzione problemi',
        'exp-title-3': 'Percorso di Apprendimento Tecnico',
        'exp-subtitle-3': 'Sviluppo Competenze ed Educazione',
        'exp-desc-3': 'Intrapreso un percorso di apprendimento intensivo per la transizione allo sviluppo software. Focalizzandomi su tecnologie web e costruzione di competenze di programmazione pratiche attraverso progetti hands-on.',
        'exp-item-3-1': 'Iscritto a bootcamp di programmazione e corsi online',
        'exp-item-3-2': 'Creato guide di studio e materiali di apprendimento',
        'exp-item-3-3': 'Costruito applicazioni web funzionali da zero',
        'exp-item-3-4': 'Cercando attivamente opportunità per applicare competenze tecniche professionalmente',
        'contact-title': 'Contattami',
        'contact-heading': 'Lavoriamo Insieme',
        'contact-text': 'Sono sempre interessato a nuove opportunità e progetti entusiasmanti. Che tu stia cercando uno sviluppatore per il tuo team o abbia bisogno di aiuto con un progetto specifico, mi piacerebbe sentirti.',
        'contact-email-label': 'Email',
        'contact-phone-label': 'Telefono',
        'contact-location-label': 'Posizione',
        'form-name': 'Nome',
        'form-email': 'Email',
        'form-subject': 'Oggetto',
        'form-message': 'Messaggio',
        'form-send': 'Invia Messaggio',
        'footer-tagline': 'Sviluppatore Software appassionato di creare soluzioni innovative.',
        'footer-copyright': '© 2025 O\'Neal Shockley. Tutti i diritti riservati.'
    },
    fr: {
        'nav-home': 'Accueil',
        'nav-about': 'À propos',
        'nav-skills': 'Compétences',
        'nav-projects': 'Projets',
        'nav-experience': 'Expérience',
        'nav-contact': 'Contact',
        'hero-greeting': 'Salut, je suis',
        'hero-title': 'Développeur Logiciel',
        'hero-description': 'Je crée des solutions logicielles innovantes et centrées sur l\'utilisateur qui évoluent parfaitement et résolvent des problèmes du monde réel. Engagé pour un code propre et maintenable, une expérience utilisateur exceptionnelle et une croissance continue en tant que développeur.',
        'btn-work': 'Voir mon travail',
        'btn-contact': 'Me contacter',
        'about-title': 'À propos de moi',
        'about-text-1': 'Je suis un développeur logiciel passionné avec une expertise dans les technologies web modernes et une base solide dans les principes de l\'informatique. J\'aime relever des défis complexes et transformer des idées en applications fonctionnelles et conviviales.',
        'about-text-2': 'Mon parcours dans le développement logiciel m\'a amené à travailler avec diverses technologies et frameworks, en restant toujours à jour avec les tendances de l\'industrie et les meilleures pratiques. Je crois en l\'écriture de code propre et maintenable et en la création de solutions qui ont un impact positif.',
        'stat-experience': 'Années d\'Expérience',
        'stat-projects': 'Projets Complétés',
        'stat-satisfaction': 'Satisfaction Client',
        'skills-title': 'Compétences Techniques',
        'skill-frontend': 'Développement Frontend',
        'skill-backend': 'Développement Backend',
        'skill-database': 'Base de Données et Cloud',
        'skill-tools': 'Outils et Autres',
        'projects-title': 'Projets en Vedette',
        'project-vantra-desc': 'Une application innovante de suivi orbital et de gestion spatiale conçue pour surveiller les mouvements de satellites et les débris spatiaux avec visualisation de données en temps réel.',
        'project-planora-desc': 'Une application complète de planification et de programmation qui aide les utilisateurs à organiser leurs tâches, événements et objectifs avec automatisation intelligente et design intuitif.',
        'project-hilllife-desc': 'Une plateforme de style de vie et de bien-être axée sur les activités de plein air, les sentiers de randonnée et la construction de communauté pour les passionnés d\'outdoor et les chercheurs d\'aventures.',
        'project-sleep-desc': 'Une application complète de suivi du sommeil qui aide les utilisateurs à surveiller leurs habitudes de sommeil, améliorer l\'hygiène du sommeil et maintenir une routine saine. Construite avec des technologies web modernes.',
        'project-dream-desc': 'Une couche applicative basée sur le cloud qui fournit une intégration transparente entre différents systèmes logiciels avec traitement avancé des données et automatisation des flux de travail.',
        'project-cd-desc': 'Une solution de pipeline de déploiement continu et d\'intégration continue qui rationalise les flux de travail de développement logiciel avec des tests automatisés, la construction et les processus de déploiement.',
        'view-code': 'Voir le Code',
        'experience-title': 'Expérience Professionnelle',
        'exp-title-1': 'Développeur Logiciel Aspirant',
        'exp-subtitle-1': 'Transition Professionnelle - Apprentissage Autodirigé',
        'exp-desc-1': 'Poursuivant actuellement une transition professionnelle vers le développement logiciel à travers un bootcamp de programmation intensif et un apprentissage autodirigé. Construisant des projets pratiques et développant des compétences techniques.',
        'exp-item-1-1': 'Terminé les cours de bootcamp de programmation en développement web',
        'exp-item-1-2': 'Construit plusieurs projets incluant SleepTrackerPro et Task Manager App',
        'exp-item-1-3': 'Apprentissage d\'HTML, CSS, JavaScript et technologies web modernes',
        'exp-item-1-4': 'Développement de projets de portfolio pour démontrer les capacités techniques',
        'exp-title-2': 'Professionnel des Ventes Fitness',
        'exp-subtitle-2': 'Industrie du Fitness',
        'exp-desc-2': 'Développé de solides compétences en communication, résolution de problèmes et relations client en travaillant dans les ventes fitness. Acquis une expérience précieuse en service client et développement commercial.',
        'exp-item-2-1': 'Construit des relations avec les clients et compris leurs besoins',
        'exp-item-2-2': 'Développé de solides compétences en communication et présentation',
        'exp-item-2-3': 'Appris à travailler sous pression et atteindre les objectifs',
        'exp-item-2-4': 'Acquis de l\'expérience en service client et résolution de problèmes',
        'exp-title-3': 'Parcours d\'Apprentissage Technique',
        'exp-subtitle-3': 'Développement de Compétences et Éducation',
        'exp-desc-3': 'Entrepris un parcours d\'apprentissage intensif pour la transition vers le développement logiciel. Me concentrant sur les technologies web et construisant des compétences de programmation pratiques à travers des projets pratiques.',
        'exp-item-3-1': 'Inscrit dans des bootcamps de programmation et cours en ligne',
        'exp-item-3-2': 'Créé des guides d\'étude et matériaux d\'apprentissage',
        'exp-item-3-3': 'Construit des applications web fonctionnelles à partir de zéro',
        'exp-item-3-4': 'Recherchant activement des opportunités d\'appliquer les compétences techniques professionnellement',
        'contact-title': 'Me contacter',
        'contact-heading': 'Travaillons Ensemble',
        'contact-text': 'Je suis toujours intéressé par de nouvelles opportunités et des projets passionnants. Que vous cherchiez un développeur pour rejoindre votre équipe ou que vous ayez besoin d\'aide avec un projet spécifique, j\'aimerais avoir de vos nouvelles.',
        'contact-email-label': 'Email',
        'contact-phone-label': 'Téléphone',
        'contact-location-label': 'Localisation',
        'form-name': 'Nom',
        'form-email': 'Email',
        'form-subject': 'Sujet',
        'form-message': 'Message',
        'form-send': 'Envoyer le Message',
        'footer-tagline': 'Développeur Logiciel passionné par la création de solutions innovantes.',
        'footer-copyright': '© 2025 O\'Neal Shockley. Tous droits réservés.'
    }
};

function translatePage(language) {
    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[language] && translations[language][key]) {
            element.textContent = translations[language][key];
        }
    });
    
    // Save language preference
    localStorage.setItem('preferredLanguage', language);
}

// Language selector event listener
document.addEventListener('DOMContentLoaded', () => {
    const languageSelect = document.getElementById('language-select');
    
    // Load saved language preference
    const savedLanguage = localStorage.getItem('preferredLanguage') || 'en';
    languageSelect.value = savedLanguage;
    translatePage(savedLanguage);
    
    languageSelect.addEventListener('change', (e) => {
        translatePage(e.target.value);
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
    }
});

// Active navigation link highlighting
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        if (window.scrollY >= sectionTop) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
});

// Form submission
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');
        
        // Simple validation
        if (!name || !email || !subject || !message) {
            alert('Please fill in all fields.');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address.');
            return;
        }
        
        // Simulate form submission
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            alert('Thank you for your message! I\'ll get back to you soon.');
            contactForm.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1500);
    });
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.skill-category, .project-card, .timeline-item, .stat');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Typing effect for hero subtitle
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing effect when page loads
document.addEventListener('DOMContentLoaded', () => {
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) {
        const originalText = heroSubtitle.textContent;
        setTimeout(() => {
            typeWriter(heroSubtitle, originalText, 80);
        }, 1000);
    }
});

// Scroll to top functionality
function createScrollToTopButton() {
    const button = document.createElement('button');
    button.innerHTML = '<i class="fas fa-arrow-up"></i>';
    button.className = 'scroll-to-top';
    button.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background-color: #2563eb;
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        font-size: 1.2rem;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
    `;
    
    button.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    document.body.appendChild(button);
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            button.style.opacity = '1';
            button.style.visibility = 'visible';
        } else {
            button.style.opacity = '0';
            button.style.visibility = 'hidden';
        }
    });
}

// Initialize scroll to top button
document.addEventListener('DOMContentLoaded', createScrollToTopButton);

// Add hover effects to project cards
document.addEventListener('DOMContentLoaded', () => {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Simple contact form handling for Netlify Forms
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.contact-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            // Show loading state
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Form will be handled by Netlify automatically
            // No need to prevent default - let it submit naturally
        });
    }
    
    // Add copy functionality for contact info
    const emailLinks = document.querySelectorAll('a[href^="mailto:shockleyoneal@gmail.com"]');
    emailLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Copy email to clipboard
            if (navigator.clipboard) {
                navigator.clipboard.writeText('shockleyoneal@gmail.com').then(() => {
                    showNotification('📋 Email copied to clipboard!');
                });
            }
        });
    });
    
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #10b981;
            color: white;
            padding: 12px 16px;
            border-radius: 8px;
            z-index: 10000;
            font-size: 14px;
            font-weight: 500;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        `;
        
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroImage = document.querySelector('.hero-image');
    
    if (heroImage && scrolled < window.innerHeight) {
        heroImage.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Skills animation on scroll
const animateSkills = () => {
    const skillTags = document.querySelectorAll('.skill-tag');
    
    skillTags.forEach((tag, index) => {
        setTimeout(() => {
            tag.style.opacity = '1';
            tag.style.transform = 'scale(1)';
        }, index * 100);
    });
};

// Initialize skills animation when skills section is in view
const skillsSection = document.querySelector('.skills');
if (skillsSection) {
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSkills();
                skillsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    skillsObserver.observe(skillsSection);
}

// Add loading animation
document.addEventListener('DOMContentLoaded', () => {
    // Hide loading overlay if it exists
    const loadingOverlay = document.querySelector('.loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.style.opacity = '0';
        setTimeout(() => {
            loadingOverlay.remove();
        }, 500);
    }
    
    // Animate hero elements
    const heroElements = document.querySelectorAll('.hero-content > *');
    heroElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 200);
    });
});

// Performance optimization: Throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Apply throttling to scroll events
window.addEventListener('scroll', throttle(() => {
    // Navbar background change
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
    }
    
    // Parallax effect
    const scrolled = window.pageYOffset;
    const heroImage = document.querySelector('.hero-image');
    
    if (heroImage && scrolled < window.innerHeight) {
        heroImage.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
}, 16)); // ~60fps

// Enhanced Features Implementation

// Typing Animation
function initTypingAnimation() {
    const typingElement = document.querySelector('.typing-animation');
    if (!typingElement) return;
    
    const phrases = [
        'Software Developer',
        'Problem Solver',
        'Code Enthusiast',
        'Tech Innovator'
    ];
    
    let currentPhrase = 0;
    let currentChar = 0;
    let isDeleting = false;
    
    function type() {
        const phrase = phrases[currentPhrase];
        
        if (isDeleting) {
            typingElement.textContent = phrase.substring(0, currentChar - 1);
            currentChar--;
        } else {
            typingElement.textContent = phrase.substring(0, currentChar + 1);
            currentChar++;
        }
        
        let typeSpeed = isDeleting ? 50 : 100;
        
        if (!isDeleting && currentChar === phrase.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && currentChar === 0) {
            isDeleting = false;
            currentPhrase = (currentPhrase + 1) % phrases.length;
            typeSpeed = 500;
        }
        
        setTimeout(type, typeSpeed);
    }
    
    type();
}

// Animated Counters
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const current = 0;
        const increment = target / 50;
        
        const updateCounter = () => {
            const currentNum = parseInt(counter.textContent);
            if (currentNum < target) {
                counter.textContent = Math.ceil(currentNum + increment);
                setTimeout(updateCounter, 40);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCounter();
    });
}

// Skills Tab Functionality
function initSkillsTabs() {
    const skillTabs = document.querySelectorAll('.skill-tab');
    const skillCategories = document.querySelectorAll('.skill-category');
    
    skillTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const category = tab.getAttribute('data-category');
            
            // Update active tab
            skillTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Show/hide categories
            skillCategories.forEach(cat => {
                if (category === 'all' || cat.getAttribute('data-category') === category) {
                    cat.style.display = 'block';
                } else {
                    cat.style.display = 'none';
                }
            });
            
            // Animate skill bars
            setTimeout(() => {
                animateSkillBars();
            }, 100);
        });
    });
}

// Animate Skill Bars
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    skillBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0%';
        setTimeout(() => {
            bar.style.width = width;
        }, 100);
    });
}

// Project Filters
function initProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');
            
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter projects
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeInUp 0.6s ease';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Project Modal (placeholder)
function openProjectModal(projectId) {
    // This would open a detailed project modal
    // For now, we'll just show an alert
    alert(`Opening detailed view for project: ${projectId}`);
}

// Testimonials Carousel
function initTestimonialsCarousel() {
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const testimonialBtns = document.querySelectorAll('.testimonial-btn');
    let currentSlide = 0;
    
    function showSlide(index) {
        testimonialCards.forEach((card, i) => {
            card.classList.toggle('active', i === index);
        });
        
        testimonialBtns.forEach((btn, i) => {
            btn.classList.toggle('active', i === index);
        });
    }
    
    testimonialBtns.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
        });
    });
    
    // Auto-rotate testimonials
    setInterval(() => {
        currentSlide = (currentSlide + 1) % testimonialCards.length;
        showSlide(currentSlide);
    }, 5000);
}

// Scroll Indicator
function initScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            document.querySelector('#about').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }
}

// Enhanced Scroll Effects
function initEnhancedScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Trigger specific animations
                if (entry.target.classList.contains('hero-stats')) {
                    animateCounters();
                }
                
                if (entry.target.classList.contains('skills')) {
                    animateSkillBars();
                }
            }
        });
    }, observerOptions);
    
    // Observe elements for animations
    document.querySelectorAll('.hero-stats, .skills, .projects, .testimonials').forEach(el => {
        observer.observe(el);
    });
}

// Enhanced Form Validation
function initEnhancedFormValidation() {
    const form = document.getElementById('contact-form');
    const inputs = form.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearErrors);
    });
    
    function validateField(e) {
        const field = e.target;
        const value = field.value.trim();
        
        // Remove existing error
        clearFieldError(field);
        
        // Validate based on field type
        let isValid = true;
        let errorMessage = '';
        
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        } else if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }
        
        if (!isValid) {
            showFieldError(field, errorMessage);
        }
    }
    
    function showFieldError(field, message) {
        field.classList.add('error');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        field.parentNode.appendChild(errorDiv);
    }
    
    function clearFieldError(field) {
        field.classList.remove('error');
        const errorMessage = field.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }
    
    function clearErrors(e) {
        clearFieldError(e.target);
    }
}

// Initialize all enhanced features
document.addEventListener('DOMContentLoaded', () => {
    initTypingAnimation();
    initSkillsTabs();
    initProjectFilters();
    initTestimonialsCarousel();
    initScrollIndicator();
    initEnhancedScrollEffects();
    initEnhancedFormValidation();
    
    // Animate counters when hero stats are visible
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    observer.unobserve(entry.target);
                }
            });
        });
        observer.observe(heroStats);
    }
});

// Add CSS for error states
const errorStyles = `
.form-group input.error,
.form-group textarea.error {
    border-color: #ef4444;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.error-message {
    color: #ef4444;
    font-size: 0.8rem;
    margin-top: 0.25rem;
}

.animate-in {
    animation: fadeInUp 0.8s ease;
}
`;

// Inject error styles
const styleSheet = document.createElement('style');
styleSheet.textContent = errorStyles;
document.head.appendChild(styleSheet);
