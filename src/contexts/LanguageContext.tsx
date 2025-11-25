import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'ar' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

interface Translations {
  [key: string]: {
    ar: string;
    en: string;
  };
}

const translations: Translations = {
  // Header
  'nav.home': { ar: 'الرئيسية', en: 'Home' },
  'nav.about': { ar: 'من نحن', en: 'About' },
  'nav.services': { ar: 'خدماتنا', en: 'Services' },
  'nav.products': { ar: 'منتجاتنا', en: 'Products' },
  'nav.partners': { ar: 'شركاؤنا', en: 'Partners' },
  'nav.gallery': { ar: 'المعرض', en: 'Gallery' },
  'nav.contact': { ar: 'اتصل بنا', en: 'Contact' },

  // Hero Section
  'hero.title': { 
    ar: 'تقديم حلول متكاملة للطاقة الشمسية، تهدف إلى توفير الطاقة النظيفة والمستدامة', 
    en: 'Providing integrated solar energy solutions, aiming to provide clean and sustainable energy.' 
  },
  'hero.subtitle': { 
    ar: 'نحن متخصصون في تقديم حلول الطاقة الشمسية المتكاملة والمبتكرة لجميع القطاعات', 
    en: 'We specialize in providing integrated and innovative solar energy solutions for all sectors' 
  },
  'hero.cta': { ar: 'اكتشف خدماتنا', en: 'Discover Our Services' },
  'hero.contact': { ar: 'تواصل معنا', en: 'Contact Us' },

  // About Section
  'about.title': { ar: 'من نحن', en: 'About Us' },
  'about.subtitle': { 
    ar: 'شركة رائدة في مجال الطاقة الشمسية', 
    en: 'A leading company in solar energy' 
  },
  'about.description': { 
    ar: 'شركة النظم المتطورة للطاقة الشمسية هي شركة متخصصة في تقديم حلول الطاقة الشمسية المتكاملة والمبتكرة. نحن نعمل على توفير أنظمة طاقة شمسية عالية الجودة وموثوقة لمختلف القطاعات السكنية والتجارية والصناعية.', 
    en: 'Advanced Solar Energy Systems Company specializes in providing integrated and innovative solar energy solutions. We work to provide high-quality and reliable solar energy systems for various residential, commercial, and industrial sectors.' 
  },
  // Brand
  'brand.name': { ar: 'فرست سن إنرجي', en: 'First Sun Energy' },
  
  // About - Detailed content
  'about.heading': { ar: 'عن شركة فرست سن إنرجي', en: 'About First Sun Energy' },
  'about.p1': { 
    ar: 'فرست سن إنرجي هي شركة متخصصة في تقديم حلول متكاملة للطاقة الشمسية، تأسست على رؤية واضحة لتحقيق كفاءة عالية في استغلال الموارد الشمسية. نتمتع بخبرة طويلة في تصميم وتنفيذ مشاريع الطاقة الشمسية لمختلف الاستخدامات السكنية، التجارية، والصناعية.', 
    en: 'First Sun Energy is specialized in providing end-to-end solar energy solutions, founded on a clear vision to maximize solar resource efficiency. We have extensive experience designing and executing solar projects for residential, commercial, and industrial uses.' 
  },
  'about.p2': { 
    ar: 'فريق عملنا المتنوع يتألف من مهندسين متخصصين في الهندسة الكهربائية والميكانيكية والطاقات المتجددة، يتمتعون بخبرة كبيرة في تصميم حلول مخصصة بدءًا من المشاريع الصغيرة وصولًا إلى المشاريع الضخمة.', 
    en: 'Our diverse team consists of engineers specialized in electrical, mechanical, and renewable energy disciplines, with strong experience crafting tailored solutions from small installations to large-scale projects.' 
  },
  'about.p3': { 
    ar: 'نلتزم بتقديم حلول مبتكرة ومستدامة، جودة عالية وفق أعلى المعايير الدولية، والالتزام بالمواعيد لرضا عملائنا. نحن شريك موثوق يعمل جاهدًا لتعزيز الانتقال نحو الطاقة النظيفة والمستدامة في المنطقة.', 
    en: 'We are committed to innovative, sustainable solutions, high quality to international standards, and on-time delivery to ensure customer satisfaction. We are a trusted partner driving the transition to clean, sustainable energy.' 
  },
  'about.stats.projects': { ar: 'مشروع منفذ', en: 'Projects Completed' },
  'about.stats.experience': { ar: 'سنوات خبرة', en: 'Years of Experience' },
  'about.image.alt': { ar: 'شعار شركة فرست سن إنرجي', en: 'First Sun Energy logo' },

  // Services Section
  'services.title': { ar: 'خدماتنا المتكاملة في الطاقة الشمسية', en: 'Our Comprehensive Solar Energy Services' },
  'services.subtitle': { 
    ar: 'نقدم مجموعة شاملة من الخدمات المتخصصة في الطاقة الشمسية لتلبية جميع احتياجاتكم', 
    en: 'We offer a comprehensive range of specialized solar energy services to meet all your needs' 
  },
  'services.design.title': { 
    ar: 'تصميم وتنفيذ مشاريع الطاقة الشمسية', 
    en: 'Solar Energy Project Design and Implementation' 
  },
  'services.design.description': { 
    ar: 'دراسة جدوى، تصميم هندسي، وتركيب أنظمة شمسية لمختلف القطاعات، بدءًا من السكنات الفردية وصولًا إلى المشاريع الكبرى.', 
    en: 'Feasibility studies, engineering design, and installation of solar systems for various sectors, from individual residences to major projects.' 
  },
  'services.battery.title': { 
    ar: 'تركيب وتشغيل أنظمة البطاريات', 
    en: 'Battery System Installation and Operation' 
  },
  'services.battery.description': { 
    ar: 'حلول تخزين طاقة متقدمة لضمان توفر الطاقة عند الحاجة، مع فريق متخصص في حساب كميات الطاقة المطلوبة وتصميم الأنظمة.', 
    en: 'Advanced energy storage solutions to ensure power availability when needed, with a specialized team in calculating required energy quantities and system design.' 
  },
  'services.offgrid.title': { 
    ar: 'حلول مستقلة وخارج الشبكة (Off-Grid)', 
    en: 'Independent and Off-Grid Solutions' 
  },
  'services.offgrid.description': { 
    ar: 'توفير أنظمة طاقة شمسية مستقلة تلبي احتياجات المناطق التي لا تتوفر فيها شبكة الكهرباء.', 
    en: 'Providing independent solar energy systems that meet the needs of areas without electrical grid access.' 
  },
  'services.equipment.title': { 
    ar: 'توفير المعدات والمستلزمات', 
    en: 'Equipment and Supplies Provision' 
  },
  'services.equipment.description': { 
    ar: 'نوفر ألواحًا شمسية عالية الجودة، بطاريات ليثيوم متطورة، وعواكس (إنفرتر) من أفضل العلامات التجارية العالمية، بالإضافة إلى عدادات ذكية.', 
    en: 'We provide high-quality solar panels, advanced lithium batteries, and inverters from the best global brands, in addition to smart meters.' 
  },
  'services.support.title': { 
    ar: 'دعم فني وتدريب مستمر', 
    en: 'Technical Support and Continuous Training' 
  },
  'services.support.description': { 
    ar: 'خدمات صيانة وإصلاح الأنظمة الشمسية، بالإضافة إلى الدعم الفني والتدريب المتقدم لضمان استمرارية وكفاءة التشغيل.', 
    en: 'Solar system maintenance and repair services, in addition to technical support and advanced training to ensure operational continuity and efficiency.' 
  },
  'services.consultation.title': { 
    ar: 'استشارات ومشورة فنية', 
    en: 'Technical Consultation and Advisory' 
  },
  'services.consultation.description': { 
    ar: 'فريق هندسي متخصص يقدم أفضل الحلول لتقدير التكلفة وتصميم النظام وفقًا لأعلى المعايير، بالتعاون مع أكبر الشركات الاستشارية.', 
    en: 'A specialized engineering team provides the best solutions for cost estimation and system design according to the highest standards, in collaboration with major consulting companies.' 
  },

  // Contact Section
  'contact.title': { ar: 'تواصل معنا', en: 'Contact Us' },
  'contact.subtitle': { 
    ar: 'نحن هنا لمساعدتكم في جميع استفساراتكم حول الطاقة الشمسية', 
    en: 'We are here to help you with all your solar energy inquiries' 
  },
  'contact.name': { ar: 'الاسم', en: 'Name' },
  'contact.email': { ar: 'البريد الإلكتروني', en: 'Email' },
  'contact.message': { ar: 'الرسالة', en: 'Message' },
  'contact.send': { ar: 'إرسال الرسالة', en: 'Send Message' },
  'contact.phone': { ar: 'الهاتف', en: 'Phone' },
  'contact.address': { ar: 'العنوان', en: 'Address' },
  'contact.infoHeading': { ar: 'معلومات التواصل', en: 'Contact Information' },
  'contact.mapHeading': { ar: 'موقعنا على الخريطة', en: 'Our Location' },
  'contact.primaryEmail': { ar: 'البريد الإلكتروني الرئيسي', en: 'Primary Email' },
  'contact.generalInfo': { ar: 'معلومات عامة', en: 'General Information' },
  'contact.maintenance': { ar: 'الصيانة', en: 'Maintenance' },
  'contact.purchases': { ar: 'المشتريات', en: 'Purchases' },
  'contact.sales': { ar: 'المبيعات', en: 'Sales' },
  'contact.cityCountry': { ar: 'الجمهورية اليمنية - صنعاء', en: 'Republic of Yemen - Sana\'a' },
  'contact.street': { ar: 'شارع الأربعين - جولة الثقافة - مقابل مفروشات المدينة التركية', en: 'Al-Arbaeen Street - Culture Roundabout - opposite Turkish City Furniture' },

  // Footer
  'footer.company': { ar: 'شركة النظم المتطورة للطاقة الشمسية', en: 'Advanced Solar Energy Systems Company' },
  'footer.description': { 
    ar: 'نحن شركة رائدة في مجال الطاقة الشمسية، نقدم حلولاً مبتكرة ومستدامة لمستقبل أفضل.', 
    en: 'We are a leading company in solar energy, providing innovative and sustainable solutions for a better future.' 
  },
  'footer.tagline': { 
    ar: 'شريكك نحو طاقة نظيفة ومستقبل مستدام. نتخصص في حلول الطاقة الشمسية المتكاملة لجميع القطاعات السكنية والتجارية والصناعية.',
    en: 'Your partner for clean energy and a sustainable future. We specialize in integrated solar solutions for residential, commercial, and industrial sectors.'
  },
  'footer.quickLinks': { ar: 'روابط سريعة', en: 'Quick Links' },
  'footer.contact': { ar: 'تواصل معنا', en: 'Contact' },
  'footer.rights': { ar: 'جميع الحقوق محفوظة', en: 'All rights reserved' },
  'footer.developer': { ar: 'تم التطوير بواسطة الحمزة عنتر', en: 'Developed by Al-Hamza Antar' },
  'social.facebook': { ar: 'فيسبوك', en: 'Facebook' },
  'social.instagram': { ar: 'إنستجرام', en: 'Instagram' },

  // Products Section
  'products.title': { ar: 'منتجاتنا المتخصصة', en: 'Our Specialized Products' },
  'products.subtitle': { ar: 'نقدم مجموعة شاملة من المنتجات عالية الجودة لأنظمة الطاقة الشمسية', en: 'We offer a comprehensive range of high-quality products for solar energy systems' },
  
  'products.tw.badge': { ar: 'شعبية من الدرجة الأولى', en: 'Top-Tier Popularity' },
  'products.tw.title': { ar: 'TW SOLAR', en: 'TW SOLAR' },
  'products.tw.description': { ar: 'يتم تسليط الضوء عليها كواحدة من العلامات التجارية "الأكثر شيوعًا"، مع التركيز على تقديم أحدث التقنيات في الألواح الشمسية.', en: 'Highlighted as one of the "Most Popular" brands, focusing on delivering the latest technology in solar panels.' },
  
  'products.hexcell.badge': { ar: 'إمكانية التحكم عن بعد', en: 'Remote Control Capability' },
  'products.hexcell.title': { ar: 'Hexcell', en: 'Hexcell' },
  'products.hexcell.description': { ar: 'توفر مقاييس "ذكية" بتركيز فريد على الدقة العالية وقدرات التحكم عن بعد المتكاملة.', en: 'Offers "Smart" meters with a unique focus on high accuracy and integrated remote control capabilities.' },
  
  'products.fnirsi.badge': { ar: 'حلول طويلة الأمد', en: 'Long-Lasting Solutions' },
  'products.fnirsi.title': { ar: 'FNIRSI', en: 'FNIRSI' },
  'products.fnirsi.description': { ar: 'تتميز بتقديم حلول طاقة "طويلة الأمد" مدعومة بمعدات عالية الجودة ومواصفات متقدمة.', en: 'Distinguished by offering "Long-lasting" energy solutions backed by high-quality equipment and advanced specifications.' },
  
  'products.kuka.badge': { ar: 'توليد الطاقة القصوى', en: 'Power Generation Maximized' },
  'products.kuka.title': { ar: 'KUKA CABLE', en: 'KUKA CABLE' },
  'products.kuka.description': { ar: 'تتموضع كشركة رائدة "الأكثر شيوعًا" في تكنولوجيا الطاقة الشمسية المخصصة لتحقيق أقصى قدر من توليد الطاقة.', en: 'Positioned as a "Most Popular" leader in solar technology dedicated to achieving maximum power generation.' },
  
  'products.sineng.badge': { ar: 'المراقبة الذكية', en: 'Intelligent Monitoring' },
  'products.sineng.title': { ar: 'SINENG', en: 'SINENG' },
  'products.sineng.description': { ar: 'تركز على "التكنولوجيا المتقدمة" في العاكسات الذكية، وتؤكد على المراقبة الذكية إلى جانب الكفاءة العالية.', en: 'Focuses on "Advanced Technology" in smart inverters, emphasizing intelligent monitoring alongside high efficiency.' },
  
  'products.mibet.badge': { ar: 'متانة استثنائية', en: 'Exceptional Durability' },
  'products.mibet.title': { ar: 'MIBET ENERGY', en: 'MIBET ENERGY' },
  'products.mibet.description': { ar: 'تُعرف بكونها الخيار "الأكثر شيوعًا" بفضل مزيج من الكفاءة العالية والمتانة الاستثنائية.', en: 'Known for being the "Most Popular" choice due to a combination of high efficiency and exceptional durability.' },
  
  'products.rjetech.badge': { ar: 'التكنولوجيا المتطورة', en: 'Cutting-Edge Technology' },
  'products.rjetech.title': { ar: 'RJEtech', en: 'RJEtech' },
  'products.rjetech.description': { ar: 'تتخصص في الحلول التقنية والمعدات "المتقدمة" التي تستخدم التكنولوجيا المتطورة.', en: 'Specializes in "Advanced" technical solutions and equipment that utilize cutting-edge technology.' },
  
  'products.danmi.badge': { ar: 'موثوقية مضمونة', en: 'Reliability Guaranteed' },
  'products.danmi.title': { ar: 'DANMI', en: 'DANMI' },
  'products.danmi.description': { ar: 'تركز على الضمان طويل الأجل والموثوقية المضمونة لأنظمة الطاقة الشمسية.', en: 'Focuses on long-term warranty and guaranteed reliability for solar energy systems.' },
  
  'products.inverter.title': { ar: 'العاكسات الشمسية', en: 'Solar Inverters' },
  'products.inverter.description': { ar: 'عاكسات شمسية عالية الكفاءة لتحويل الطاقة الشمسية إلى طاقة كهربائية قابلة للاستخدام', en: 'High-efficiency solar inverters for converting solar energy into usable electrical power' },

  // Partners Section
  'partners.title': { ar: 'شركاء النجاح حول العالم', en: 'Global Success Partners' },
  'partners.subtitle': { ar: 'نتعاون مع أفضل الشركات العالمية لنقدم لكم أجود المنتجات والحلول', en: 'We collaborate with the world\'s best companies to provide you with the finest products and solutions' },
  
  // Auth Page
  'auth.title': {
    ar: 'دخول المشرف',
    en: 'Admin Access'
  },
  'auth.description': {
    ar: 'سجل الدخول لإدارة محتوى موقعك',
    en: 'Sign in to manage your website content'
  },
  'auth.signin': {
    ar: 'تسجيل الدخول',
    en: 'Sign In'
  },
  'auth.signup': {
    ar: 'إنشاء حساب',
    en: 'Sign Up'
  },
  'auth.email': {
    ar: 'البريد الإلكتروني',
    en: 'Email'
  },
  'auth.password': {
    ar: 'كلمة المرور',
    en: 'Password'
  },
  'auth.signinButton': {
    ar: 'تسجيل الدخول',
    en: 'Sign In'
  },
  'auth.signupButton': {
    ar: 'إنشاء حساب',
    en: 'Create Account'
  },
  'auth.signinLoading': {
    ar: 'جاري تسجيل الدخول...',
    en: 'Signing in...'
  },
  'auth.signupLoading': {
    ar: 'جاري إنشاء الحساب...',
    en: 'Creating account...'
  },
  
  // Dashboard Page
  'dashboard.loading': {
    ar: 'جاري التحميل...',
    en: 'Loading...'
  },
  'dashboard.accessDenied': {
    ar: 'تم رفض الوصول',
    en: 'Access Denied'
  },
  'dashboard.accessDeniedDesc': {
    ar: 'ليس لديك صلاحيات المشرف. يرجى الاتصال بالمسؤول.',
    en: "You don't have admin permissions. Please contact the administrator."
  },
  'dashboard.signOut': {
    ar: 'تسجيل الخروج',
    en: 'Sign Out'
  },
  'dashboard.title': {
    ar: 'لوحة تحكم المحتوى',
    en: 'Content Dashboard'
  },
  'dashboard.subtitle': {
    ar: 'إدارة محتوى موقعك',
    en: 'Manage your website content'
  },
  'dashboard.overview': {
    ar: 'نظرة عامة',
    en: 'Overview'
  },
  'dashboard.translations': {
    ar: 'الترجمات',
    en: 'Translations'
  },
  'dashboard.gallery': {
    ar: 'المعرض',
    en: 'Gallery'
  },
  'dashboard.products': {
    ar: 'المنتجات',
    en: 'Products'
  },
  'dashboard.partners': {
    ar: 'الشركاء',
    en: 'Partners'
  },
  'dashboard.hero': {
    ar: 'القسم الرئيسي',
    en: 'Hero'
  },
  'dashboard.about': {
    ar: 'من نحن',
    en: 'About'
  },
  'dashboard.tabs.overview': {
    ar: 'نظرة عامة',
    en: 'Overview'
  },
  'dashboard.tabs.products': {
    ar: 'المنتجات',
    en: 'Products'
  },
  'dashboard.tabs.articles': {
    ar: 'المقالات',
    en: 'Articles'
  },
  'dashboard.tabs.settings': {
    ar: 'الإعدادات',
    en: 'Settings'
  },
  'dashboard.productsManager.title': {
    ar: 'مدير المنتجات',
    en: 'Products Manager'
  },
  'dashboard.productsManager.description': {
    ar: 'إضافة وإدارة المنتجات للمعرض',
    en: 'Add and manage products for the gallery'
  },
  'dashboard.articlesManager.title': {
    ar: 'مدير المقالات',
    en: 'Articles Manager'
  },
  'dashboard.articlesManager.description': {
    ar: 'إنشاء وإدارة مقالات الأخبار',
    en: 'Create and manage news articles'
  },
  'dashboard.articlesManager.search': {
    ar: 'بحث في المقالات...',
    en: 'Search articles...'
  },
  'dashboard.articlesManager.addArticle': {
    ar: 'إضافة مقالة جديدة',
    en: 'Add New Article'
  },
  'dashboard.articlesManager.titleAr': {
    ar: 'العنوان (عربي)',
    en: 'Title (Arabic)'
  },
  'dashboard.articlesManager.titleEn': {
    ar: 'العنوان (إنجليزي)',
    en: 'Title (English)'
  },
  'dashboard.articlesManager.excerptAr': {
    ar: 'المقتطف (عربي)',
    en: 'Excerpt (Arabic)'
  },
  'dashboard.articlesManager.excerptEn': {
    ar: 'المقتطف (إنجليزي)',
    en: 'Excerpt (English)'
  },
  'dashboard.articlesManager.contentAr': {
    ar: 'المحتوى (عربي)',
    en: 'Content (Arabic)'
  },
  'dashboard.articlesManager.contentEn': {
    ar: 'المحتوى (إنجليزي)',
    en: 'Content (English)'
  },
  'dashboard.articlesManager.mediaType': {
    ar: 'نوع الوسائط',
    en: 'Media Type'
  },
  'dashboard.articlesManager.image': {
    ar: 'صورة',
    en: 'Image'
  },
  'dashboard.articlesManager.video': {
    ar: 'فيديو',
    en: 'Video'
  },
  'dashboard.articlesManager.imageUrl': {
    ar: 'رابط الصورة',
    en: 'Image URL'
  },
  'dashboard.articlesManager.videoUrl': {
    ar: 'رابط الفيديو',
    en: 'Video URL'
  },
  'dashboard.articlesManager.uploadFile': {
    ar: 'رفع ملف',
    en: 'Upload File'
  },
  'dashboard.articlesManager.orEnterUrl': {
    ar: 'أو أدخل رابط',
    en: 'Or enter URL'
  },
  'dashboard.articlesManager.uploading': {
    ar: 'جاري الرفع...',
    en: 'Uploading...'
  },
  'dashboard.articlesManager.published': {
    ar: 'منشور',
    en: 'Published'
  },
  'dashboard.articlesManager.create': {
    ar: 'إنشاء مقالة',
    en: 'Create Article'
  },
  'dashboard.articlesManager.save': {
    ar: 'حفظ التغييرات',
    en: 'Save Changes'
  },
  'dashboard.articlesManager.cancel': {
    ar: 'إلغاء',
    en: 'Cancel'
  },
  'dashboard.articlesManager.edit': {
    ar: 'تعديل',
    en: 'Edit'
  },
  'dashboard.articlesManager.delete': {
    ar: 'حذف',
    en: 'Delete'
  },
  'dashboard.articlesManager.deleteConfirm': {
    ar: 'هل أنت متأكد؟',
    en: 'Are you sure?'
  },
  'dashboard.articlesManager.deleteDescription': {
    ar: 'هذا الإجراء لا يمكن التراجع عنه. سيتم حذف المقالة نهائياً.',
    en: 'This action cannot be undone. This will permanently delete the article.'
  },
  
  // Users Management
  'dashboard.users.title': {
    ar: 'إدارة المستخدمين',
    en: 'User Management'
  },
  'dashboard.users.allUsers': {
    ar: 'جميع المستخدمين',
    en: 'All Users'
  },
  'dashboard.users.createUser': {
    ar: 'إنشاء مستخدم جديد',
    en: 'Create New User'
  },
  'dashboard.users.changePassword': {
    ar: 'تغيير كلمة المرور',
    en: 'Change User Password'
  },
  'dashboard.users.email': {
    ar: 'البريد الإلكتروني',
    en: 'Email'
  },
  'dashboard.users.password': {
    ar: 'كلمة المرور',
    en: 'Password'
  },
  'dashboard.users.confirmPassword': {
    ar: 'تأكيد كلمة المرور',
    en: 'Confirm Password'
  },
  'dashboard.users.newPassword': {
    ar: 'كلمة المرور الجديدة',
    en: 'New Password'
  },
  'dashboard.users.createUserButton': {
    ar: 'إنشاء مستخدم',
    en: 'Create User'
  },
  'dashboard.users.changePasswordButton': {
    ar: 'تغيير كلمة المرور',
    en: 'Change Password'
  },
  'dashboard.users.createdAt': {
    ar: 'تاريخ الإنشاء',
    en: 'Created At'
  },
  'dashboard.users.roles': {
    ar: 'الأدوار',
    en: 'Roles'
  },
  'dashboard.users.actions': {
    ar: 'الإجراءات',
    en: 'Actions'
  },
  'dashboard.users.deleteConfirm': {
    ar: 'هل أنت متأكد؟',
    en: 'Are you sure?'
  },
  'dashboard.users.deleteDescription': {
    ar: 'هذا الإجراء لا يمكن التراجع عنه. سيتم حذف المستخدم نهائياً.',
    en: 'This action cannot be undone. This will permanently delete the user.'
  },
  'dashboard.users.delete': {
    ar: 'حذف',
    en: 'Delete'
  },
  'dashboard.users.cancel': {
    ar: 'إلغاء',
    en: 'Cancel'
  },
  
  // Settings
  'dashboard.settings.title': {
    ar: 'تغيير كلمة المرور',
    en: 'Change My Password'
  },
  'dashboard.settings.description': {
    ar: 'تحديث كلمة مرور حسابك',
    en: 'Update your account password'
  },
  'dashboard.settings.newPassword': {
    ar: 'كلمة المرور الجديدة',
    en: 'New Password'
  },
  'dashboard.settings.confirmPassword': {
    ar: 'تأكيد كلمة المرور الجديدة',
    en: 'Confirm New Password'
  },
  'dashboard.settings.changePasswordButton': {
    ar: 'تغيير كلمة المرور',
    en: 'Change Password'
  },
  
  // Overview
  'overview.totalProducts': {
    ar: 'إجمالي المنتجات',
    en: 'Total Products'
  },
  'overview.productsInDatabase': {
    ar: 'المنتجات في قاعدة البيانات',
    en: 'Products in database'
  },
  'overview.totalUsers': {
    ar: 'إجمالي المستخدمين',
    en: 'Total Users'
  },
  'overview.registeredUsers': {
    ar: 'المستخدمون المسجلون',
    en: 'Registered users'
  },
  'overview.totalArticles': {
    ar: 'إجمالي المقالات',
    en: 'Total Articles'
  },
  'overview.publishedArticles': {
    ar: 'المقالات المنشورة',
    en: 'Published articles'
  },
  'overview.recentProducts': {
    ar: 'التغييرات الأخيرة في المنتجات',
    en: 'Recent Products Changes'
  },
  'overview.recentArticles': {
    ar: 'التغييرات الأخيرة في المقالات',
    en: 'Recent Articles Changes'
  },
  'overview.recentUsers': {
    ar: 'التغييرات الأخيرة في المستخدمين',
    en: 'Recent Users Changes'
  },
  'overview.userEmail': {
    ar: 'البريد الإلكتروني',
    en: 'User Email'
  },
  'overview.createdAt': {
    ar: 'تاريخ الإنشاء',
    en: 'Created At'
  },
  'overview.productName': {
    ar: 'اسم المنتج',
    en: 'Product Name'
  },
  'overview.lastUpdated': {
    ar: 'آخر تحديث',
    en: 'Last Updated'
  },
  'overview.articleTitle': {
    ar: 'عنوان المقالة',
    en: 'Article Title'
  },
  'overview.status': {
    ar: 'الحالة',
    en: 'Status'
  },
  'overview.published': {
    ar: 'منشور',
    en: 'Published'
  },
  'overview.draft': {
    ar: 'مسودة',
    en: 'Draft'
  },
  'overview.email': {
    ar: 'البريد الإلكتروني',
    en: 'Email'
  },
  'overview.role': {
    ar: 'الدور',
    en: 'Role'
  },
  'overview.noData': {
    ar: 'لا توجد بيانات حتى الآن',
    en: 'No data yet'
  },
  
  // Toast Messages - Common
  'toast.success': {
    ar: 'تم بنجاح',
    en: 'Success'
  },
  'toast.error': {
    ar: 'خطأ',
    en: 'Error'
  },
  'toast.loading': {
    ar: 'جاري التحميل...',
    en: 'Loading...'
  },
  
  // Toast Messages - Users
  'toast.users.createSuccess': {
    ar: 'تم إنشاء المستخدم بنجاح',
    en: 'User created successfully'
  },
  'toast.users.createError': {
    ar: 'فشل إنشاء المستخدم',
    en: 'Failed to create user'
  },
  'toast.users.deleteSuccess': {
    ar: 'تم حذف المستخدم بنجاح',
    en: 'User deleted successfully'
  },
  'toast.users.deleteError': {
    ar: 'فشل حذف المستخدم',
    en: 'Failed to delete user'
  },
  'toast.users.passwordChangeSuccess': {
    ar: 'تم تغيير كلمة المرور بنجاح',
    en: 'Password changed successfully'
  },
  'toast.users.passwordChangeError': {
    ar: 'فشل تغيير كلمة المرور',
    en: 'Failed to change password'
  },
  'toast.users.loadError': {
    ar: 'فشل تحميل المستخدمين',
    en: 'Failed to load users'
  },
  
  // Toast Messages - Settings
  'toast.settings.passwordChangeSuccess': {
    ar: 'تم تغيير كلمة المرور! يرجى تسجيل الدخول بكلمة المرور الجديدة.',
    en: 'Password changed! Please sign in with your new password.'
  },
  'toast.settings.passwordChangeError': {
    ar: 'فشل تغيير كلمة المرور',
    en: 'Failed to change password'
  },
  'toast.settings.notAuthenticated': {
    ar: 'غير مصرح',
    en: 'Not authenticated'
  },
  'toast.settings.userEmailNotFound': {
    ar: 'لم يتم العثور على البريد الإلكتروني للمستخدم',
    en: 'User email not found'
  },
  
  // Toast Messages - Articles
  'toast.articles.createSuccess': {
    ar: 'تم إنشاء المقالة بنجاح',
    en: 'Article created successfully'
  },
  'toast.articles.createError': {
    ar: 'فشل إنشاء المقالة',
    en: 'Error creating article'
  },
  'toast.articles.updateSuccess': {
    ar: 'تم تحديث المقالة بنجاح',
    en: 'Article updated successfully'
  },
  'toast.articles.updateError': {
    ar: 'فشل تحديث المقالة',
    en: 'Error updating article'
  },
  'toast.articles.deleteSuccess': {
    ar: 'تم حذف المقالة بنجاح',
    en: 'Article deleted successfully'
  },
  'toast.articles.deleteError': {
    ar: 'فشل حذف المقالة',
    en: 'Error deleting article'
  },
  'toast.articles.loadError': {
    ar: 'جاري التحميل...',
    en: 'Loading articles...'
  },
  
  // Toast Messages - Products
  'toast.products.createSuccess': {
    ar: 'تم إنشاء المنتج بنجاح',
    en: 'Product created successfully'
  },
  'toast.products.createError': {
    ar: 'فشل إنشاء المنتج',
    en: 'Failed to create product'
  },
  'toast.products.updateSuccess': {
    ar: 'تم تحديث المنتج بنجاح',
    en: 'Product updated successfully'
  },
  'toast.products.updateError': {
    ar: 'فشل تحديث المنتج',
    en: 'Failed to update product'
  },
  'toast.products.deleteSuccess': {
    ar: 'تم حذف المنتج بنجاح',
    en: 'Product deleted successfully'
  },
  'toast.products.deleteError': {
    ar: 'فشل حذف المنتج',
    en: 'Failed to delete product'
  },
  
  // Toast Messages - Partners
  'toast.partners.createSuccess': {
    ar: 'تم إضافة الشريك بنجاح',
    en: 'Partner added successfully'
  },
  'toast.partners.createError': {
    ar: 'فشل إضافة الشريك',
    en: 'Failed to add partner'
  },
  'toast.partners.updateSuccess': {
    ar: 'تم تحديث الشريك بنجاح',
    en: 'Partner updated successfully'
  },
  'toast.partners.updateError': {
    ar: 'فشل تحديث الشريك',
    en: 'Failed to update partner'
  },
  'toast.partners.deleteSuccess': {
    ar: 'تم حذف الشريك بنجاح',
    en: 'Partner deleted successfully'
  },
  'toast.partners.deleteError': {
    ar: 'فشل حذف الشريك',
    en: 'Failed to delete partner'
  },
  
  // Validation Messages
  'validation.invalidEmail': {
    ar: 'عنوان البريد الإلكتروني غير صالح',
    en: 'Invalid email address'
  },
  'validation.passwordMinLength': {
    ar: 'يجب أن تكون كلمة المرور 8 أحرف على الأقل',
    en: 'Password must be at least 8 characters'
  },
  'validation.passwordsNoMatch': {
    ar: 'كلمات المرور غير متطابقة',
    en: "Passwords don't match"
  },
  'validation.required': {
    ar: 'هذا الحقل مطلوب',
    en: 'This field is required'
  },
  
  // Products Manager
  'productsManager.addProduct': {
    ar: 'إضافة منتج رئيسي',
    en: 'Add Main Product'
  },
  'productsManager.imageUrl': {
    ar: 'رابط الصورة',
    en: 'Image URL'
  },
  'productsManager.imageUrlPlaceholder': {
    ar: 'https://example.com/image.jpg',
    en: 'https://example.com/image.jpg'
  },
  'productsManager.nameEn': {
    ar: 'الاسم (إنجليزي)',
    en: 'Name (English)'
  },
  'productsManager.nameEnPlaceholder': {
    ar: 'Product name in English',
    en: 'Product name in English'
  },
  'productsManager.nameAr': {
    ar: 'الاسم (عربي)',
    en: 'Name (Arabic)'
  },
  'productsManager.nameArPlaceholder': {
    ar: 'اسم المنتج بالعربية',
    en: 'اسم المنتج بالعربية'
  },
  'productsManager.descEn': {
    ar: 'الوصف (إنجليزي)',
    en: 'Description (English)'
  },
  'productsManager.descEnPlaceholder': {
    ar: 'Description in English',
    en: 'Description in English'
  },
  'productsManager.descAr': {
    ar: 'الوصف (عربي)',
    en: 'Description (Arabic)'
  },
  'productsManager.descArPlaceholder': {
    ar: 'الوصف بالعربية',
    en: 'الوصف بالعربية'
  },
  'productsManager.category': {
    ar: 'الفئة',
    en: 'Category'
  },
  'productsManager.selectCategory': {
    ar: 'اختر فئة',
    en: 'Select a category'
  },
  'productsManager.displayOrder': {
    ar: 'ترتيب العرض',
    en: 'Display Order'
  },
  'productsManager.save': {
    ar: 'حفظ',
    en: 'Save'
  },
  'productsManager.cancel': {
    ar: 'إلغاء',
    en: 'Cancel'
  },
  'productsManager.edit': {
    ar: 'تعديل',
    en: 'Edit'
  },
  'productsManager.delete': {
    ar: 'حذف',
    en: 'Delete'
  },
  'productsManager.badge': {
    ar: 'الشارة',
    en: 'Badge'
  },
  'productsManager.order': {
    ar: 'الترتيب',
    en: 'Order'
  },
  'productsManager.searchPlaceholder': {
    ar: 'ابحث عن المنتجات...',
    en: 'Search products...'
  },
  'productsManager.noResults': {
    ar: 'لا توجد نتائج بحث',
    en: 'No results found'
  },
  
  // User Management
  'userManagement.createUser': {
    ar: 'إنشاء مستخدم',
    en: 'Create User'
  },
  'userManagement.email': {
    ar: 'البريد الإلكتروني',
    en: 'Email'
  },
  'userManagement.password': {
    ar: 'كلمة المرور',
    en: 'Password'
  },
  'userManagement.confirmPassword': {
    ar: 'تأكيد كلمة المرور',
    en: 'Confirm Password'
  },
  'userManagement.creating': {
    ar: 'جاري الإنشاء...',
    en: 'Creating...'
  },
  'userManagement.userCreated': {
    ar: 'تم إنشاء المستخدم بنجاح',
    en: 'User created successfully'
  },
  'userManagement.createError': {
    ar: 'فشل في إنشاء المستخدم',
    en: 'Failed to create user'
  },
  'userManagement.changePassword': {
    ar: 'تغيير كلمة المرور',
    en: 'Change Password'
  },
  'userManagement.userEmail': {
    ar: 'البريد الإلكتروني للمستخدم',
    en: 'User Email'
  },
  'userManagement.newPassword': {
    ar: 'كلمة المرور الجديدة',
    en: 'New Password'
  },
  'userManagement.changing': {
    ar: 'جاري التغيير...',
    en: 'Changing...'
  },
  'userManagement.passwordChanged': {
    ar: 'تم تغيير كلمة المرور بنجاح',
    en: 'Password changed successfully'
  },
  'userManagement.changePasswordError': {
    ar: 'فشل في تغيير كلمة المرور',
    en: 'Failed to change password'
  },
  'userManagement.userNotFound': {
    ar: 'المستخدم غير موجود',
    en: 'User not found'
  },
  'dashboard.users': {
    ar: 'المستخدمين',
    en: 'Users'
  },
  
  // Gallery Manager
  'galleryManager.addItem': {
    ar: 'إضافة عنصر للمعرض',
    en: 'Add Gallery Item'
  },
  'galleryManager.imageUrl': {
    ar: 'رابط الصورة',
    en: 'Image URL'
  },
  'galleryManager.titleKey': {
    ar: 'مفتاح العنوان',
    en: 'Title Key'
  },
  'galleryManager.descKey': {
    ar: 'مفتاح الوصف',
    en: 'Description Key'
  },
  'galleryManager.category': {
    ar: 'الفئة',
    en: 'Category'
  },
  'galleryManager.order': {
    ar: 'الترتيب',
    en: 'Order'
  },
  'galleryManager.save': {
    ar: 'حفظ',
    en: 'Save'
  },
  'galleryManager.cancel': {
    ar: 'إلغاء',
    en: 'Cancel'
  },
  'galleryManager.edit': {
    ar: 'تعديل',
    en: 'Edit'
  },
  
  // Partners Manager
  'partnersManager.addPartner': {
    ar: 'إضافة شريك',
    en: 'Add Partner'
  },
  'partnersManager.name': {
    ar: 'الاسم',
    en: 'Name'
  },
  'partnersManager.logoUrl': {
    ar: 'رابط الشعار',
    en: 'Logo URL'
  },
  'partnersManager.order': {
    ar: 'الترتيب',
    en: 'Order'
  },
  'partnersManager.save': {
    ar: 'حفظ',
    en: 'Save'
  },
  'partnersManager.cancel': {
    ar: 'إلغاء',
    en: 'Cancel'
  },
  'partnersManager.edit': {
    ar: 'تعديل',
    en: 'Edit'
  },
  'partnersManager.namePlaceholder': {
    ar: 'اسم الشريك',
    en: 'Partner name'
  },
  
  // Site Content Manager
  'siteContentManager.sectionContent': {
    ar: 'محتوى القسم',
    en: 'Section Content'
  },
  'siteContentManager.content': {
    ar: 'المحتوى (تنسيق JSON)',
    en: 'Content (JSON format)'
  },
  'siteContentManager.save': {
    ar: 'حفظ التغييرات',
    en: 'Save Changes'
  },
  'siteContentManager.delete': {
    ar: 'حذف',
    en: 'Delete'
  },
  'dashboard.contact': {
    ar: 'اتصل بنا',
    en: 'Contact'
  },
  'dashboard.manage': {
    ar: 'إدارة',
    en: 'Manage'
  },
  'dashboard.arabicEnglishText': {
    ar: 'النصوص العربية والإنجليزية',
    en: 'Arabic & English text'
  },
  'dashboard.galleryItems': {
    ar: 'عناصر المعرض',
    en: 'Gallery items'
  },
  'dashboard.mainProducts': {
    ar: 'المنتجات الرئيسية',
    en: 'Main Products'
  },
  'dashboard.items': {
    ar: 'عناصر',
    en: 'Items'
  },
  'dashboard.featuredProducts': {
    ar: 'المنتجات المميزة',
    en: 'Featured products'
  },
  'dashboard.partnerLogos': {
    ar: 'شعارات الشركاء',
    en: 'Partner logos'
  },
  'dashboard.welcomeTitle': {
    ar: 'مرحباً في لوحة التحكم',
    en: 'Welcome to Your Dashboard'
  },
  'dashboard.welcomeDesc': {
    ar: 'إدارة جميع محتوى موقعك من مكان واحد. يتم حفظ التغييرات فوراً في قاعدة البيانات.',
    en: 'Manage all your website content from one place. Changes are saved instantly to the database.'
  },
  'dashboard.useTabsAbove': {
    ar: 'استخدم علامات التبويب أعلاه للتنقل بين أقسام المحتوى المختلفة:',
    en: 'Use the tabs above to navigate between different content sections:'
  },
  'dashboard.translationsDesc': {
    ar: 'تحرير جميع النصوص بالعربية والإنجليزية',
    en: 'Edit all text in Arabic and English'
  },
  'dashboard.galleryDesc': {
    ar: 'إدارة منتجات المعرض مع الصور',
    en: 'Manage gallery products with images'
  },
  'dashboard.productsDesc': {
    ar: 'تحرير عناصر عرض المنتجات الرئيسية',
    en: 'Edit main product showcase items'
  },
  'dashboard.partnersDesc': {
    ar: 'إضافة/تحرير شعارات الشركاء',
    en: 'Add/edit partner logos'
  },
  'dashboard.sectionsDesc': {
    ar: 'تحديث أقسام الصفحة',
    en: 'Update page sections'
  },
  'dashboard.translationsManager': {
    ar: 'مدير الترجمات',
    en: 'Translations Manager'
  },
  'dashboard.editTextContent': {
    ar: 'تحرير محتوى النص بالعربية والإنجليزية',
    en: 'Edit text content in Arabic and English'
  },
  'dashboard.galleryProducts': {
    ar: 'منتجات المعرض',
    en: 'Gallery Products'
  },
  'dashboard.manageGallery': {
    ar: 'إدارة عناصر منتجات المعرض',
    en: 'Manage gallery product items'
  },
  'dashboard.editFeatured': {
    ar: 'تحرير المنتجات المميزة',
    en: 'Edit featured products'
  },
  'dashboard.managePartners': {
    ar: 'إدارة شعارات الشركاء',
    en: 'Manage partner logos'
  },
  'dashboard.heroSection': {
    ar: 'القسم الرئيسي',
    en: 'Hero Section'
  },
  'dashboard.editHero': {
    ar: 'تحرير محتوى القسم الرئيسي',
    en: 'Edit homepage hero content'
  },
  'dashboard.aboutSection': {
    ar: 'قسم من نحن',
    en: 'About Section'
  },
  'dashboard.editAbout': {
    ar: 'تحرير محتوى صفحة من نحن',
    en: 'Edit about page content'
  },
  'dashboard.contactInfo': {
    ar: 'معلومات الاتصال',
    en: 'Contact Information'
  },
  'dashboard.editContact': {
    ar: 'تحرير تفاصيل الاتصال',
    en: 'Edit contact details'
  },
  'dashboard.comingSoon': {
    ar: 'قريباً...',
    en: 'coming soon...'
  },
  'dashboard.6Items': {
    ar: '6 عناصر',
    en: '6 Items'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const savedLang = localStorage.getItem('language') as Language;
    return savedLang || 'ar';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  };

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  const isRTL = language === 'ar';

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};