import React, { useState, useEffect } from 'react';
import { INITIAL_PORTFOLIO_DATA } from './data/initialPortfolioData';
import { getPortfolioData, subscribeToPortfolio } from './services/portfolioService';
import { useTheme } from './context/ThemeContext';
import { Toast } from './components/Toast';
import { Lightbox } from './components/Lightbox';
import { Navbar } from './components/Navbar';
import { RadialSidebar } from './components/RadialSidebar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Experience } from './components/Experience';
import { Organization } from './components/Organization';
import { VerticalShowcase } from './components/VerticalShowcase';
import { Projects } from './components/Projects';
import { ProjectModal } from './components/sections/ProjectModal';
import { Skills } from './components/Skills';
import { Contact } from './components/Contact';
import { AdminModal } from './components/admin/AdminModal';

export default function App() {
  const { isDark } = useTheme();

  // Master Portfolio Data state
  const [portfolioData, setPortfolioData] = useState(INITIAL_PORTFOLIO_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);

  // Navigation & Interactive UI State
  const [activeSection, setActiveSection] = useState('home');
  const [activeProjectModal, setActiveProjectModal] = useState(null);
  const [lightboxMedia, setLightboxMedia] = useState(null);

  // Admin Studio State
  const [adminOpen, setAdminOpen] = useState(false);
  const [adminInitialTab, setAdminInitialTab] = useState('profile');

  const notify = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // 1. Load Data from Supabase / Local Cache on Mount
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const data = await getPortfolioData();
        if (isMounted) setPortfolioData(data);
      } catch (err) {
        console.error('Failed to load portfolio data:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    loadData();

    // 2. Realtime Subscription from Supabase
    const unsubscribe = subscribeToPortfolio(async () => {
      try {
        const freshData = await getPortfolioData();
        if (isMounted) setPortfolioData(freshData);
      } catch (e) {
        console.warn('Realtime refresh error:', e);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  // 3. Scroll Spy for Section Indicator
  useEffect(() => {
    const sectionIds = ['home', 'about', 'experience', 'organization', 'projects', 'showcase', 'skills', 'contact'];
    const handleScroll = () => {
      const scrollPos = window.scrollY + 260;
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sectionIds[i]);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleOpenAdminWithTab = (tab = 'profile') => {
    setAdminInitialTab(tab);
    setAdminOpen(true);
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-500 selection:bg-[#CFE3F2] selection:text-[#2C2520] ${
        isDark ? 'bg-[#17243A] text-[#E1E5EB]' : 'bg-[#FFF9F0] text-[#4A423C]'
      }`}
    >
      {/* Toast Notification */}
      <Toast message={toastMessage} isDark={isDark} />

      {/* Top Header / Navbar */}
      <Navbar
        activeSection={activeSection}
        onNavigate={scrollToSection}
        onOpenAdmin={() => handleOpenAdminWithTab('profile')}
      />

      {/* Hero Section */}
      <Hero
        hero={portfolioData.hero}
        onExploreClick={() => scrollToSection('projects')}
        onConnectClick={() => scrollToSection('contact')}
      />

      {/* About Section */}
      <About
        about={portfolioData.about}
        fallbackImage={portfolioData.hero?.profileImage}
      />

      {/* Experience Section */}
      <Experience
        experiences={portfolioData.experiences}
        onMediaClick={(media) => setLightboxMedia(media)}
      />

      {/* Organization Section */}
      <Organization
        organizations={portfolioData.organizations}
        onManageGallery={() => handleOpenAdminWithTab('organization')}
        onMediaClick={(media) => setLightboxMedia(media)}
      />

      {/* Interactive Vertical Typography Archive */}
      <VerticalShowcase
        verticalShowcase={portfolioData.verticalShowcase}
        onManageCategory={(cat) => handleOpenAdminWithTab('vertical')}
        onMediaClick={(media) => setLightboxMedia(media)}
      />

      {/* Selected Works Projects Section */}
      <Projects
        projects={portfolioData.projects}
        onProjectSelect={(proj) => setActiveProjectModal(proj)}
      />

      {/* Capabilities & Skills Section */}
      <Skills skills={portfolioData.skills} />

      {/* Footer & Contact */}
      <Contact
        contact={portfolioData.contact}
        onOpenAdmin={() => handleOpenAdminWithTab('profile')}
      />

      {/* Circular Radial Orbit Navigation */}
      <RadialSidebar
        activeSection={activeSection}
        onNavigate={scrollToSection}
      />

      {/* Project Detail Modal */}
      {activeProjectModal && (
        <ProjectModal
          project={activeProjectModal}
          onClose={() => setActiveProjectModal(null)}
        />
      )}

      {/* Fullscreen Media Lightbox */}
      {lightboxMedia && (
        <Lightbox
          media={lightboxMedia}
          onClose={() => setLightboxMedia(null)}
        />
      )}

      {/* Admin Dashboard Studio Modal */}
      <AdminModal
        isOpen={adminOpen}
        onClose={() => setAdminOpen(false)}
        portfolioData={portfolioData}
        initialTab={adminInitialTab}
        onUpdatePortfolio={(updated) => setPortfolioData(updated)}
        onNotify={notify}
      />
    </div>
  );
}
