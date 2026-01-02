
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { User, View, Subject, Exam, Report, Notification, Theme, Group, StudyReminder } from './types';
import { getLoggedInUser, logout, updateUser, clearReports as clearUserReports, getTheme, saveTheme, joinGroup, getGroupByCode } from './services/storage';
import { SUBJECTS } from './constants';
import Header from './components/Header';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import LearningZone from './components/LearningZone';
import ExamZone from './components/ExamZone';
import ReportCard from './components/ReportCard';
import Settings from './components/Settings';
import NeuralArena from './components/NeuralArena'; 
import CodeLab from './components/CodeLab'; 
import StudyPlanZone from './components/StudyPlanZone';
import ClassroomZone from './components/ClassroomZone';
import NotebookZone from './components/NotebookZone';
import SubjectHub from './components/SubjectHub';
import TeamRoom from './components/TeamRoom';
import CustomExamRoom from './components/CustomExamRoom';
import { APP_NAME } from './constants';
import { CheckCircleIcon, ExclamationTriangleIcon, XCircleIcon, InformationCircleIcon } from './components/common/Icons';

const BrainaryLogo: React.FC<{ className?: string }> = ({ className = "w-16 h-16" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2a10 10 0 0 0-10 10c0 5.52 4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16z" fill="currentColor" fillOpacity="0.15"/>
    <circle cx="12" cy="8" r="1.5" fill="currentColor"/>
    <path d="M11 11h2v6h-2v-6z" fill="currentColor"/>
    <path d="M12 4a8 8 0 0 0-8 8c0 4.418 3.582 8 8 8s8-3.582 8-8c0-4.418-3.582-8-8-8zm0 14c-3.314 0-6-2.686-6-6s2.686-6 6-6 6 2.686 6 6-2.686 6-6 6z" fill="currentColor" fillOpacity="0.4"/>
    <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" fill="currentColor"/>
  </svg>
);

const SplashScreen: React.FC = () => (
  <div className="fixed inset-0 bg-white flex flex-col justify-center items-center z-50 animate-soft-bg-shift dark:bg-slate-900">
    <div className="flex flex-col items-center gap-6 relative">
      <div className="relative animate-logo-float">
        <div className="text-primary animate-intelligent-appear logo-container">
           <div className="animate-logo-pulse-glow">
              <BrainaryLogo className="w-24 h-24 md:w-32 md:h-32 mb-4" />
           </div>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary/5 rounded-full blur-3xl -z-10"></div>
      </div>
      
      <div className="relative text-center">
        <h1 className="text-6xl md:text-8xl font-black text-primary animate-intelligent-appear tracking-tighter [animation-delay:0.3s]">
          {APP_NAME}
        </h1>
        <p className="mt-4 text-text-secondary dark:text-slate-500 font-bold tracking-[0.4em] uppercase text-[9px] md:text-[11px] animate-fade-in opacity-0 [animation-delay:1.2s]">
          Intelligence for Mastery
        </p>
      </div>
    </div>
  </div>
);

const NotificationComponent: React.FC<{ notification: Notification; onDismiss: (id: number) => void; }> = ({ notification, onDismiss }) => {
    const iconMap = {
        success: <CheckCircleIcon className="w-6 h-6 text-green-500" />,
        warning: <ExclamationTriangleIcon className="w-6 h-6 text-yellow-500" />,
        error: <XCircleIcon className="w-6 h-6 text-red-500" />,
        info: <InformationCircleIcon className="w-6 h-6 text-blue-500" />,
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-4 flex items-start space-x-4 animate-slide-in-up dark:bg-slate-800 dark:border dark:border-slate-700">
            <div>{iconMap[notification.type || 'info']}</div>
            <div className="flex-1">
                <p className="font-semibold text-text-primary dark:text-slate-100">{notification.message}</p>
            </div>
            <button onClick={() => onDismiss(notification.id)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <XCircleIcon className="w-5 h-5" />
            </button>
        </div>
    );
};

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<View>(View.HOME);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [currentExam, setCurrentExam] = useState<Exam | null>(null);
  const [currentReport, setCurrentReport] = useState<Report | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [theme, setTheme] = useState<Theme>(getTheme());
  
  const triggeredThisMinute = useRef<string[]>([]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    saveTheme(theme);
  }, [theme]);

  const handleThemeToggle = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const addNotification = useCallback((message: string, type: Notification['type'] = 'success') => {
      const id = Date.now();
      setNotifications(prev => [...prev, { id, message, type }]);
      setTimeout(() => {
          setNotifications(prev => prev.filter(n => n.id !== id));
      }, 7000);
  }, []);

  useEffect(() => {
    if (!user || !user.reminders) return;

    const interval = setInterval(() => {
        const now = new Date();
        const currentHHMM = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        
        if (now.getSeconds() === 0) {
            triggeredThisMinute.current = [];
        }

        user.reminders?.forEach(rem => {
            if (rem.enabled && rem.time === currentHHMM && !triggeredThisMinute.current.includes(rem.id)) {
                addNotification(`Study Time: ${rem.label}`, 'info');
                triggeredThisMinute.current.push(rem.id);
            }
        });
    }, 10000);

    return () => clearInterval(interval);
  }, [user, addNotification]);

  useEffect(() => {
    const splashTimer = setTimeout(() => {
      setShowSplash(false);
    }, 3200);
    return () => clearTimeout(splashTimer);
  }, []);
  
  const showDashboard = useCallback(() => {
    setSelectedSubject(null);
    setCurrentExam(null);
    setCurrentReport(null);
    setCurrentView(View.DASHBOARD);
  }, []);

  const enterSubject = useCallback((subject: Subject) => {
    setSelectedSubject(subject);
    setCurrentView(View.SUBJECT_HUB);
  }, []);

  useEffect(() => {
    if (!showSplash) {
      const storedUser = getLoggedInUser();
      const urlParams = new URLSearchParams(window.location.search);
      const joinCode = urlParams.get('join');

      if (storedUser) {
        setUser(storedUser);
        if (joinCode) {
          const group = getGroupByCode(joinCode);
          if (group) {
            joinGroup(joinCode, storedUser);
            const subject = SUBJECTS.find(s => s.name === group.subject);
            if (subject) {
              addNotification(`Automatically joined ${group.name}!`, 'success');
              const newUrl = window.location.origin + window.location.pathname;
              window.history.replaceState({}, '', newUrl);
              setSelectedSubject(subject);
              setCurrentView(View.TEAM_ROOM);
            }
          }
        } else {
          setCurrentView(View.DASHBOARD);
        }
      } else {
        setCurrentView(View.HOME);
      }
    }
  }, [showSplash, addNotification]);

  const dismissNotification = (id: number) => {
      setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const showLogin = () => setCurrentView(View.LOGIN);
  const showRegister = () => setCurrentView(View.REGISTER);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setCurrentView(View.DASHBOARD);
  };

  const handleRegister = (newUser: User) => {
    setUser(newUser);
    setCurrentView(View.DASHBOARD);
  };
  
  const handleUserUpdate = (updatedUser: User) => {
    updateUser(updatedUser);
    const freshlyUpdatedUser = getLoggedInUser();
    if(freshlyUpdatedUser) setUser(freshlyUpdatedUser);
  };
  
  const handleSettingsSave = (updatedUser: User) => {
      handleUserUpdate(updatedUser);
      addNotification('Profile updated successfully!');
  };
  
  const handleClearReports = () => {
    if (user && window.confirm('Are you sure you want to delete all exam reports?')) {
        clearUserReports(user.username);
        addNotification('Reports wiped.', 'warning');
    }
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    setSelectedSubject(null);
    setCurrentExam(null);
    setCurrentReport(null);
    setCurrentView(View.HOME);
  };

  const startLearning = useCallback(() => {
    setCurrentView(View.LEARNING);
  }, []);

  const startClassroom = useCallback(() => {
    setCurrentView(View.CLASSROOM);
  }, []);

  const startNotebook = useCallback(() => {
    setCurrentView(View.NOTEBOOK);
  }, []);

  const startExam = useCallback((subject: Subject, exam: Exam) => {
    setSelectedSubject(subject);
    setCurrentExam(exam);
    setCurrentView(View.EXAM);
  }, []);

  const startTeamRoom = useCallback(() => {
    setCurrentView(View.TEAM_ROOM);
  }, []);
  
  const startArena = useCallback(() => {
    setCurrentView(View.ARENA);
  }, []);

  const startCodeLab = useCallback(() => {
    setCurrentView(View.CODELAB);
  }, []);

  const startStudyPlan = useCallback(() => {
    setCurrentView(View.STUDY_PLAN);
  }, []);

  const viewReport = useCallback((report: Report, subject: Subject) => {
    setCurrentReport(report);
    setSelectedSubject(subject);
    setCurrentView(View.REPORT);
  }, []);

  const showSubjectHub = useCallback(() => {
    setCurrentView(View.SUBJECT_HUB);
  }, []);
  
  const showSettings = useCallback(() => {
    setCurrentView(View.SETTINGS);
  }, []);

  const showExamResults = useCallback((report: Report) => {
      setCurrentReport(report);
      setCurrentView(View.REPORT);
  }, []);

  const startCustomExam = useCallback(() => {
      setCurrentView(View.CUSTOM_EXAM);
  }, []);

  const renderContent = () => {
    if (showSplash) return null;
    
    switch (currentView) {
      case View.HOME:
        return <Home onLoginClick={showLogin} onRegisterClick={showRegister} />;
      case View.LOGIN:
        return <Login onLogin={handleLogin} onGoToRegister={showRegister} />;
      case View.REGISTER:
        return <Register onRegister={handleRegister} onGoToLogin={showLogin} />;
      case View.DASHBOARD:
        return <Dashboard 
          user={user!} 
          onEnterSubject={enterSubject}
          onShowReport={viewReport} 
          onUpdateUser={handleUserUpdate} 
          onEnterCustomExam={startCustomExam}
          addNotification={addNotification} 
        />;
      case View.SUBJECT_HUB:
        return <SubjectHub 
          user={user!}
          subject={selectedSubject!}
          onBack={showDashboard}
          onStartLearning={startLearning}
          onStartClassroom={startClassroom}
          onStartNotebook={startNotebook}
          onStartExamRequest={startExam}
          onStartFlashcards={startArena}
          onStartStudyPlan={startStudyPlan}
          onStartTeamRoom={startTeamRoom}
          onStartCodeLab={startCodeLab}
          addNotification={addNotification}
        />;
      case View.LEARNING:
        return <LearningZone user={user!} subject={selectedSubject!} onBack={showSubjectHub} />;
      case View.CLASSROOM:
        return <ClassroomZone user={user!} subject={selectedSubject!} onBack={showSubjectHub} />;
      case View.NOTEBOOK:
        return <NotebookZone user={user!} subject={selectedSubject!} onBack={showSubjectHub} />;
      case View.TEAM_ROOM:
        return <TeamRoom user={user!} subject={selectedSubject!} onBack={showSubjectHub} onStartExam={startExam} addNotification={addNotification} />;
      case View.EXAM:
        return <ExamZone user={user!} subject={selectedSubject!} exam={currentExam!} onFinishExam={showExamResults} onBack={showSubjectHub} onUpdateUser={handleUserUpdate} />;
      case View.REPORT:
        return <ReportCard user={user!} report={currentReport!} subject={selectedSubject!} onBack={showDashboard} onStartExam={startExam} onUpdateUser={handleUserUpdate} addNotification={addNotification} />;
      case View.SETTINGS:
        return <Settings user={user!} onSave={handleSettingsSave} onClearReports={handleClearReports} onBack={showDashboard} />;
      case View.ARENA:
        return <NeuralArena user={user!} subject={selectedSubject!} onBack={showSubjectHub} onUpdateUser={handleUserUpdate} />;
      case View.CODELAB:
        return <CodeLab user={user!} subject={selectedSubject!} onBack={showSubjectHub} />;
      case View.STUDY_PLAN:
        return <StudyPlanZone user={user!} subject={selectedSubject!} onBack={showSubjectHub} />;
      case View.CUSTOM_EXAM:
        return <CustomExamRoom user={user!} onBack={showDashboard} onStartExam={startExam} addNotification={addNotification} />;
      default:
        return <Home onLoginClick={showLogin} onRegisterClick={showRegister} />;
    }
  };
  
  const isAuthView = !showSplash && (currentView === View.HOME || currentView === View.LOGIN || currentView === View.REGISTER);

  return (
    <div className="min-h-screen bg-background dark:bg-slate-900 font-sans text-text-primary dark:text-slate-100">
      {showSplash && <SplashScreen />}
      
      <div className="fixed top-4 right-4 z-[200] space-y-2 pointer-events-none">
        {notifications.map(n => (
            <div key={n.id} className="pointer-events-auto">
                <NotificationComponent notification={n} onDismiss={dismissNotification} />
            </div>
        ))}
      </div>

      {!showSplash && !isAuthView && <Header user={user} onLogout={handleLogout} onShowSettings={showSettings} theme={theme} onThemeToggle={handleThemeToggle} />}
      <main className={!isAuthView && !showSplash ? "container mx-auto p-4 md:p-8" : ""}>
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
