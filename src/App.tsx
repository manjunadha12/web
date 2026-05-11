import React, { useEffect, useState } from 'react'
import {
  Activity,
  AlertTriangle,
  BadgeCheck,
  Bell,
  Brain,
  Building2,
  Calendar,
  CheckCircle2,
  ClipboardList,
  Clock,
  CreditCard,
  FileText,
  HeartPulse,
  Hospital,
  IndianRupee,
  LayoutDashboard,
  MapPin,
  MessageSquareText,
  Pill,
  QrCode,
  Search,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  TestTube2,
  UploadCloud,
  UserRound,
  UserPlus,
  Users,
  Video,
} from 'lucide-react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

type Role = 'doctor' | 'patient' | 'admin'
type Page =
  | 'login'
  | 'doctor-login'
  | 'patient-login'
  | 'admin-login'
  | 'signup'
  | 'patient-register'
  | 'doctor-register'
  | 'forgot'
  | 'otp'
  | 'reset'
  | 'dashboard'
  | 'patient-search'
  | 'ai-diagnosis'
  | 'op-tokens'
  | 'prescriptions'
  | 'video-notes'
  | 'reports'
  | 'booking'
  | 'medicines'
  | 'emergency'
  | 'hospital'
  | 'cost'

type Patient = {
  id: string
  name: string
  age: number
  gender: string
  bloodGroup: string
  city: string
  allergies: string[]
  avatar: string
  conditions: string[]
  emergencyContact: string
}

type Doctor = {
  id: string
  name: string
  speciality: string
  hospital: string
  fee: number
  rating: number
  experience: string
  avatar: string
}

type Report = {
  id: string
  patientId: string
  name: string
  uploadedAt: string
  values: { label: string; value: string; status: 'Low' | 'High' | 'Normal' }[]
  aiSummary: string
  concerns: string[]
}

type Appointment = {
  token: number
  currentToken: number
  time: string
  status: string
  hospital: string
  type: string
}

type QueueItem = {
  token: number
  name: string
  note: string
  urgent?: boolean
}

type BootstrapData = {
  patient: Patient
  doctors: Doctor[]
  report: Report
  appointment: Appointment
  queue: QueueItem[]
}

const fallbackData: BootstrapData = {
  patient: {
    id: 'PID-9921',
    name: 'Priya Sharma',
    age: 28,
    gender: 'Female',
    bloodGroup: 'O+',
    city: 'Chennai',
    allergies: ['Penicillin'],
    avatar: 'https://i.pravatar.cc/150?img=5',
    conditions: ['Mild Hypertension', 'Fatigue for 3 days'],
    emergencyContact: 'Rahul Sharma +91 98765 12345',
  },
  doctors: [
    {
      id: 'MC-DOC-8492',
      name: 'Dr. Aravind Kumar',
      speciality: 'Senior Cardiologist',
      hospital: 'Apollo Hospitals, Chennai',
      fee: 1000,
      rating: 4.9,
      experience: '15 yrs',
      avatar: 'https://i.pravatar.cc/150?img=11',
    },
    {
      id: 'MC-DOC-7110',
      name: 'Dr. Sarah Reddy',
      speciality: 'Hematologist',
      hospital: 'Apollo Hospitals, Chennai',
      fee: 1200,
      rating: 4.8,
      experience: '12 yrs',
      avatar: 'https://i.pravatar.cc/150?img=47',
    },
    {
      id: 'MC-DOC-6024',
      name: 'Dr. Manoj Kumar',
      speciality: 'Internal Medicine',
      hospital: 'Fortis Malar Hospital',
      fee: 800,
      rating: 4.6,
      experience: '18 yrs',
      avatar: 'https://i.pravatar.cc/150?img=12',
    },
  ],
  report: {
    id: 'RPT-CBC-001',
    patientId: 'PID-9921',
    name: 'CBC_Blood_Test.pdf',
    uploadedAt: 'Today, 08:15 AM',
    values: [
      { label: 'Hemoglobin', value: '10.2 g/dL', status: 'Low' },
      { label: 'WBC Count', value: '11.5 k/uL', status: 'High' },
      { label: 'Platelets', value: '250 k/uL', status: 'Normal' },
    ],
    aiSummary:
      'AI detects mild anemia with a possible inflammatory response. The patient may feel tired and should avoid penicillin-based antibiotics due to allergy history.',
    concerns: ['Anemia risk', 'Possible infection', 'Drug allergy caution'],
  },
  appointment: {
    token: 45,
    currentToken: 42,
    time: '10:30 AM',
    status: 'Waiting',
    hospital: 'Apollo Hospitals, Chennai',
    type: 'In-person OP',
  },
  queue: [
    { token: 42, name: 'Priya Sharma', note: '28F - follow-up consult' },
    { token: 43, name: 'Suresh Kumar', note: 'Chest pain - emergency priority', urgent: true },
    { token: 44, name: 'Rahul Verma', note: 'General checkup' },
    { token: 45, name: 'Anitha Rao', note: 'Post-scan review' },
  ],
}

const recoveryData = [
  { day: 'Mon', score: 64, bp: 132, sugar: 104 },
  { day: 'Tue', score: 68, bp: 128, sugar: 99 },
  { day: 'Wed', score: 73, bp: 126, sugar: 97 },
  { day: 'Thu', score: 79, bp: 122, sugar: 96 },
  { day: 'Fri', score: 84, bp: 120, sugar: 95 },
  { day: 'Sat', score: 88, bp: 118, sugar: 94 },
  { day: 'Sun', score: 92, bp: 118, sugar: 95 },
]

const aiFeatures = [
  'AI Lab Report Analyzer',
  'AI Doctor Recommendation',
  'AI Hospital Recommendation',
  'AI Operation Cost Prediction',
  'AI Risk Detection',
  'AI Health Summary',
  'AI Follow-up Suggestion',
]

export function App() {
  const [role, setRole] = useState<Role>('patient')
  const [page, setPage] = useState<Page>('login')
  const [data, setData] = useState<BootstrapData>(fallbackData)
  const [apiReady, setApiReady] = useState(false)

  useEffect(() => {
    fetch('/api/bootstrap')
      .then((response) => response.json())
      .then((payload) => {
        setData({
          patient: payload.patient || payload.patients?.[0] || fallbackData.patient,
          doctors: payload.doctors || fallbackData.doctors,
          report: payload.report || payload.reports?.[0] || fallbackData.report,
          appointment: payload.appointment || payload.appointments?.[0] || fallbackData.appointment,
          queue: payload.queue || fallbackData.queue,
        })
        setApiReady(true)
      })
      .catch(() => setApiReady(false))
  }, [])

  const goDashboard = (nextRole = role) => {
    setRole(nextRole)
    setPage('dashboard')
  }

  if (!isDashboardPage(page)) {
    return (
      <div className="min-h-screen bg-[#eef5fb] text-slate-950">
        <AuthShell page={page} role={role} setRole={setRole} setPage={setPage} goDashboard={goDashboard} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#eef5fb] text-slate-950">
      <Header role={role} setRole={setRole} setPage={setPage} apiReady={apiReady} />
      <div className="mx-auto grid max-w-[1500px] gap-6 px-4 py-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:px-8">
        <Sidebar role={role} activePage={page} setPage={setPage} />
        <main className="min-w-0 space-y-6">
          <Hero role={role} />
          <DashboardScreen role={role} page={page} data={data} setPage={setPage} />
        </main>
      </div>
      <AIChat role={role} />
    </div>
  )
}

function isDashboardPage(page: Page) {
  return !['login', 'doctor-login', 'patient-login', 'admin-login', 'signup', 'patient-register', 'doctor-register', 'forgot', 'otp', 'reset'].includes(page)
}

function Header({
  role,
  setRole,
  setPage,
  apiReady,
}: {
  role: Role
  setRole: (role: Role) => void
  setPage: (page: Page) => void
  apiReady: boolean
}) {
  return (
    <header className="sticky top-0 z-50 border-b border-blue-100 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-[1500px] items-center justify-between px-4 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
            <Activity className="h-6 w-6" />
          </div>
          <div>
            <p className="text-lg font-black tracking-tight">Medi Consult</p>
            <p className="hidden text-xs font-semibold text-slate-500 md:block">
              Multi-Agent Swarm Integrated Diagnostic & Management System
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`hidden rounded-full px-3 py-1 text-xs font-black md:inline-flex ${apiReady ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
            API {apiReady ? 'Online' : 'Fallback'}
          </span>
          {(['doctor', 'patient', 'admin'] as const).map((item) => (
            <button
              key={item}
              onClick={() => {
                setRole(item)
                setPage('dashboard')
              }}
              className={`rounded-xl px-4 py-2 text-sm font-black capitalize transition ${role === item ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-slate-50 text-slate-600 hover:bg-blue-50 hover:text-blue-700'}`}
            >
              {item}
            </button>
          ))}
          <button className="relative rounded-xl bg-slate-50 p-2.5 text-slate-600">
            <Bell className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
          </button>
          <button onClick={() => setPage('login')} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-black text-slate-600">
            Login
          </button>
        </div>
      </div>
    </header>
  )
}

function Sidebar({ role, activePage, setPage }: { role: Role; activePage: Page; setPage: (page: Page) => void }) {
  const items: [string, React.ElementType, Page][] =
    role === 'doctor'
      ? [
          ['Dashboard', LayoutDashboard, 'dashboard'],
          ['Patient Search', Search, 'patient-search'],
          ['AI Diagnosis', Brain, 'ai-diagnosis'],
          ['OP Tokens', Activity, 'op-tokens'],
          ['Prescriptions', Pill, 'prescriptions'],
          ['Video Notes', Video, 'video-notes'],
        ]
      : role === 'admin'
        ? [
            ['Dashboard', LayoutDashboard, 'dashboard'],
            ['Doctors', Stethoscope, 'patient-search'],
            ['Patients', Users, 'reports'],
            ['Reports', FileText, 'ai-diagnosis'],
            ['Billing', CreditCard, 'cost'],
            ['AI Chat', Brain, 'ai-diagnosis'],
          ]
        : [
            ['Dashboard', LayoutDashboard, 'dashboard'],
            ['Book Appointment', Calendar, 'booking'],
            ['Upload Report', UploadCloud, 'reports'],
            ['AI Insights', Brain, 'ai-diagnosis'],
            ['Medicines', Pill, 'medicines'],
            ['Emergency QR', QrCode, 'emergency'],
          ]
  return (
    <aside className="hidden rounded-3xl border border-blue-100 bg-white p-4 shadow-soft lg:block">
      <p className="px-3 pb-3 text-xs font-black uppercase tracking-wider text-slate-400">
        {role === 'doctor' ? 'Doctor Console' : 'Patient App'}
      </p>
      <nav className="space-y-2">
        {items.map(([label, Icon, target]) => (
          <button
            key={label as string}
            onClick={() => setPage(target)}
            className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-black transition ${activePage === target ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-600 hover:bg-blue-50 hover:text-blue-700'}`}
          >
            <Icon className="h-5 w-5" />
            {label as string}
          </button>
        ))}
      </nav>
      <div className="mt-6 rounded-3xl border border-violet-100 bg-violet-50 p-4">
        <div className="mb-3 flex items-center gap-2 text-violet-700">
          <Sparkles className="h-5 w-5" />
          <p className="text-sm font-black">AI Swarm Layer</p>
        </div>
        <div className="space-y-2">
          {aiFeatures.slice(0, 5).map((feature) => (
            <p key={feature} className="rounded-xl bg-white/70 px-3 py-2 text-xs font-bold text-violet-800">
              {feature}
            </p>
          ))}
        </div>
      </div>
    </aside>
  )
}

function Hero({ role }: { role: Role }) {
  return (
    <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 p-6 text-white shadow-soft">
      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:items-end">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-black backdrop-blur">
            <Brain className="h-4 w-4" />
            AI diagnosis support, specialist routing, hospital selection, and cost prediction
          </div>
          <h1 className="max-w-4xl text-3xl font-black leading-tight md:text-5xl">
            {role === 'doctor' ? 'Doctor Dashboard' : role === 'admin' ? 'Admin Dashboard' : 'Patient Dashboard'} for intelligent healthcare operations
          </h1>
          <p className="mt-3 max-w-3xl text-sm font-medium leading-6 text-blue-50 md:text-base">
            A modern blue-white medical command center that combines OP management, report intelligence, recovery tracking, and AI-powered decision support.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {aiFeatures.slice(0, 4).map((feature) => (
            <div key={feature} className="rounded-2xl bg-white/14 p-3 text-xs font-black text-white backdrop-blur">
              {feature}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function DashboardScreen({
  role,
  page,
  data,
  setPage,
}: {
  role: Role
  page: Page
  data: BootstrapData
  setPage: (page: Page) => void
}) {
  if (role === 'admin') return <AdminDashboard data={data} setPage={setPage} />
  if (role === 'doctor') {
    if (page === 'patient-search') return <PatientSearchPanel patient={data.patient} />
    if (page === 'ai-diagnosis') return <AIReportPanel report={data.report} mode="doctor" />
    if (page === 'op-tokens') return <OPTokenPanel queue={data.queue} />
    if (page === 'prescriptions') return <PrescriptionPanel />
    if (page === 'video-notes') return <VideoNotesPanel />
    if (page === 'cost') return <CostEstimatorPanel />
    return <DoctorDashboard data={data} setPage={setPage} />
  }
  if (page === 'booking') return <AppointmentPanel appointment={data.appointment} doctor={data.doctors[0]} />
  if (page === 'reports') return <UploadPanel />
  if (page === 'ai-diagnosis') return <AIReportPanel report={data.report} mode="patient" />
  if (page === 'medicines') return <MedicineReminderPanel />
  if (page === 'emergency') return <EmergencyPanel patient={data.patient} />
  if (page === 'hospital') return <HospitalPanel doctors={data.doctors} />
  if (page === 'cost') return <CostEstimatorPanel patientMode />
  return <PatientDashboard data={data} setPage={setPage} />
}

function DoctorDashboard({ data, setPage }: { data: BootstrapData; setPage: (page: Page) => void }) {
  const doctor = data.doctors[0]
  return (
    <div className="space-y-6">
      <ProfileCard
        avatar={doctor.avatar}
        title={doctor.name}
        subtitle={`${doctor.speciality} | ${doctor.hospital}`}
        badge={doctor.id}
        icon={<Stethoscope className="h-5 w-5" />}
        action="8 notifications"
      />
      <QuickActions
        items={[
          ['View Reports', FileText, 'patient-search'],
          ['Analyze with AI', Brain, 'ai-diagnosis'],
          ['Suggest Specialist', Users, 'ai-diagnosis'],
          ['Estimate Cost', IndianRupee, 'cost'],
          ['Write Prescription', Pill, 'prescriptions'],
          ['Start Video Call', Video, 'video-notes'],
          ['Schedule Follow-up', Calendar, 'op-tokens'],
        ]}
        setPage={setPage}
      />
      <div className="grid gap-4 md:grid-cols-5">
        <Metric title="Today's OP Count" value="42" icon={<Users />} />
        <Metric title="Completed" value="18" icon={<CheckCircle2 />} tone="emerald" />
        <Metric title="Pending" value="24" icon={<Clock />} tone="amber" />
        <Metric title="Emergency" value="2" icon={<AlertTriangle />} tone="red" />
        <Metric title="Follow-ups" value="8" icon={<ClipboardList />} tone="violet" />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.9fr]">
        <div className="space-y-6">
          <PatientSearchPanel patient={data.patient} />
          <AIReportPanel report={data.report} mode="doctor" />
          <div className="grid gap-6 lg:grid-cols-2">
            <AITreatmentPanel />
            <VideoNotesPanel />
          </div>
          <RecoveryPanel />
        </div>
        <div className="space-y-6">
          <OPTokenPanel queue={data.queue} />
          <SpecialistPanel doctors={data.doctors} />
          <CostEstimatorPanel />
          <PrescriptionPanel />
        </div>
      </div>
    </div>
  )
}

function PatientDashboard({ data, setPage }: { data: BootstrapData; setPage: (page: Page) => void }) {
  return (
    <div className="space-y-6">
      <ProfileCard
        avatar={data.patient.avatar}
        title={data.patient.name}
        subtitle={`${data.patient.id} | ${data.patient.age} yrs, ${data.patient.gender}, ${data.patient.bloodGroup} | ${data.patient.city}`}
        badge="Patient profile"
        icon={<UserRound className="h-5 w-5" />}
        action="3 notifications"
      />
      <QuickActions
        items={[
          ['Upload Report', UploadCloud, 'reports'],
          ['Analyze Report', Brain, 'ai-diagnosis'],
          ['Find Best Doctor', Stethoscope, 'hospital'],
          ['Estimate Operation Cost', IndianRupee, 'cost'],
          ['Book Appointment', Calendar, 'booking'],
          ['View Medicine Reminder', Pill, 'medicines'],
        ]}
        setPage={setPage}
      />
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.9fr]">
        <div className="space-y-6">
          <AppointmentPanel appointment={data.appointment} doctor={data.doctors[0]} />
          <UploadPanel />
          <AIReportPanel report={data.report} mode="patient" />
          <HospitalPanel doctors={data.doctors} />
          <RecoveryPanel patientMode />
        </div>
        <div className="space-y-6">
          <SpecialistPanel doctors={data.doctors} patientMode />
          <CostEstimatorPanel patientMode />
          <MedicineReminderPanel />
          <VideoConsultPanel />
          <BillPanel />
          <EmergencyPanel patient={data.patient} />
        </div>
      </div>
    </div>
  )
}

function ProfileCard({
  avatar,
  title,
  subtitle,
  badge,
  icon,
  action,
}: {
  avatar: string
  title: string
  subtitle: string
  badge: string
  icon: React.ReactNode
  action: string
}) {
  return (
    <section className="flex flex-col gap-4 rounded-3xl border border-blue-100 bg-white p-5 shadow-soft md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-4">
        <div className="relative">
          <img src={avatar} alt={title} className="h-20 w-20 rounded-3xl border-4 border-white object-cover shadow-lg" />
          <span className="absolute -bottom-1 -right-1 rounded-xl bg-emerald-500 p-1.5 text-white ring-4 ring-white">
            <BadgeCheck className="h-4 w-4" />
          </span>
        </div>
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <h2 className="text-2xl font-black">{title}</h2>
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">
              {icon}
              {badge}
            </span>
          </div>
          <p className="text-sm font-semibold text-slate-600">{subtitle}</p>
        </div>
      </div>
      <button className="inline-flex w-fit items-center gap-2 rounded-2xl bg-slate-50 px-4 py-3 text-sm font-black text-slate-700">
        <Bell className="h-4 w-4 text-blue-600" />
        {action}
      </button>
    </section>
  )
}

function QuickActions({ items, setPage }: { items: [string, React.ElementType, Page][]; setPage: (page: Page) => void }) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
      {items.map(([label, Icon, target], index) => (
        <button
          key={label}
          onClick={() => setPage(target)}
          className={`inline-flex shrink-0 items-center gap-2 rounded-2xl px-4 py-3 text-sm font-black shadow-sm transition ${index === 1 ? 'bg-violet-600 text-white shadow-violet-600/20' : index === 0 ? 'bg-blue-600 text-white shadow-blue-600/20' : 'border border-blue-100 bg-white text-slate-700 hover:border-blue-200 hover:text-blue-700'}`}
        >
          <Icon className="h-4 w-4" />
          {label}
        </button>
      ))}
    </div>
  )
}

function Card({ title, icon, children, ai = false }: { title: string; icon: React.ReactNode; children: React.ReactNode; ai?: boolean }) {
  return (
    <section className={`rounded-3xl border bg-white shadow-soft ${ai ? 'border-violet-200 ring-1 ring-violet-100' : 'border-blue-100'}`}>
      <div className="flex items-center justify-between border-b border-slate-100 p-5">
        <h3 className="flex min-w-0 items-center gap-2 text-base font-black text-slate-950">
          {icon}
          {title}
        </h3>
        {ai && (
          <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-3 py-1 text-xs font-black text-violet-700">
            <Sparkles className="h-3.5 w-3.5" />
            AI Powered
          </span>
        )}
      </div>
      <div className="p-5">{children}</div>
    </section>
  )
}

function Metric({ title, value, icon, tone = 'blue' }: { title: string; value: string; icon: React.ReactNode; tone?: 'blue' | 'emerald' | 'amber' | 'red' | 'violet' }) {
  const tones = {
    blue: 'bg-blue-50 text-blue-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    red: 'bg-red-50 text-red-600',
    violet: 'bg-violet-50 text-violet-600',
  }
  return (
    <div className="rounded-3xl border border-blue-100 bg-white p-4 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-black uppercase tracking-wide text-slate-500">{title}</p>
        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl [&>svg]:h-5 [&>svg]:w-5 ${tones[tone]}`}>
          {icon}
        </span>
      </div>
      <p className="mt-3 text-3xl font-black">{value}</p>
    </div>
  )
}

function PatientSearchPanel({ patient }: { patient: Patient }) {
  const tabs = ['Health History', 'Uploaded Reports', 'Prescriptions', 'Bills']
  return (
    <Card title="Patient ID Search" icon={<Search className="h-5 w-5 text-blue-600" />}>
      <div className="mb-5 flex gap-3">
        <input className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold outline-none focus:border-blue-500" defaultValue={patient.id} />
        <button className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-black text-white">Search</button>
      </div>
      <div className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <img src={patient.avatar} alt={patient.name} className="h-16 w-16 rounded-2xl object-cover" />
          <div className="min-w-0 flex-1">
            <p className="text-lg font-black">{patient.name}</p>
            <p className="text-sm font-semibold text-slate-500">
              {patient.age} yrs | {patient.gender} | {patient.bloodGroup} | Allergy: {patient.allergies.join(', ')}
            </p>
          </div>
          <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-black text-red-700">Penicillin alert</span>
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-4">
          {tabs.map((tab, index) => (
            <button key={tab} className={`rounded-2xl px-3 py-2 text-xs font-black ${index === 0 ? 'bg-blue-600 text-white' : 'bg-white text-slate-600'}`}>
              {tab}
            </button>
          ))}
        </div>
      </div>
    </Card>
  )
}

function AIReportPanel({ report, mode }: { report: Report; mode: 'doctor' | 'patient' }) {
  return (
    <Card title={mode === 'doctor' ? 'AI Report Analysis' : 'AI Report Analysis in Simple Language'} icon={<Brain className="h-5 w-5 text-violet-600" />} ai>
      <div className="grid gap-4 lg:grid-cols-[1fr_1.1fr]">
        <div className="space-y-3">
          {report.values.map((item) => (
            <div key={item.label} className={`rounded-2xl border p-4 ${item.status === 'Low' ? 'border-red-100 bg-red-50' : item.status === 'High' ? 'border-amber-100 bg-amber-50' : 'border-emerald-100 bg-emerald-50'}`}>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-wide text-slate-500">{item.label}</p>
                  <p className="mt-1 text-lg font-black">{item.value}</p>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-slate-700">{item.status}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-3xl border border-violet-100 bg-violet-50 p-5">
          <p className="text-xs font-black uppercase tracking-wide text-violet-700">AI health summary</p>
          <p className="mt-3 text-sm font-semibold leading-6 text-slate-700">{report.aiSummary}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {report.concerns.map((concern) => (
              <span key={concern} className="rounded-full bg-white px-3 py-1 text-xs font-black text-violet-700">
                {concern}
              </span>
            ))}
          </div>
          <div className="mt-5 rounded-2xl bg-white p-4 text-sm font-semibold text-slate-600">
            {mode === 'doctor'
              ? 'Suggested follow-up: serum ferritin, peripheral smear, repeat CBC in 2 weeks, and antibiotic review due to allergy.'
              : 'This means your iron level may be low and your body may be fighting a mild infection. Please consult a doctor before taking antibiotics.'}
          </div>
        </div>
      </div>
    </Card>
  )
}

function SpecialistPanel({ doctors, patientMode = false }: { doctors: Doctor[]; patientMode?: boolean }) {
  return (
    <Card title={patientMode ? 'AI Specialist Suggestion' : 'AI Doctor Suggestion Support'} icon={<Stethoscope className="h-5 w-5 text-violet-600" />} ai>
      <div className="space-y-3">
        {doctors.slice(1).map((doctor, index) => (
          <div key={doctor.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <div className="flex items-center gap-3">
              <img src={doctor.avatar} alt={doctor.name} className="h-12 w-12 rounded-2xl object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-black">{doctor.name}</p>
                <p className="truncate text-xs font-semibold text-slate-500">{doctor.speciality} | {doctor.experience}</p>
              </div>
              <span className="rounded-full bg-violet-50 px-2.5 py-1 text-xs font-black text-violet-700">{index === 0 ? '98%' : '85%'} match</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

function AITreatmentPanel() {
  return (
    <Card title="AI Treatment Suggestion" icon={<HeartPulse className="h-5 w-5 text-violet-600" />} ai>
      <div className="space-y-4">
        <div className="rounded-2xl bg-amber-50 p-4">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-black text-amber-900">Risk Level</p>
            <span className="rounded-full bg-amber-200 px-3 py-1 text-xs font-black text-amber-900">Moderate</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white">
            <div className="h-full w-[58%] rounded-full bg-gradient-to-r from-emerald-400 via-amber-400 to-red-500" />
          </div>
        </div>
        {['Serum ferritin and peripheral smear', 'Non-penicillin antibiotic review', 'Repeat CBC after 2 weeks'].map((item) => (
          <p key={item} className="flex gap-2 text-sm font-semibold text-slate-600">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-violet-600" />
            {item}
          </p>
        ))}
      </div>
    </Card>
  )
}

function CostEstimatorPanel({ patientMode = false }: { patientMode?: boolean }) {
  return (
    <Card title={patientMode ? 'AI Operation/Treatment Cost Estimator' : 'AI Operation Cost Estimation'} icon={<IndianRupee className="h-5 w-5 text-violet-600" />} ai>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Field label={patientMode ? 'Scan / Treatment' : 'Disease Type'} value={patientMode ? 'Advanced CBC + consult' : 'Angioplasty'} />
          <Field label="Hospital Type" value="Tier 1" />
          <Field label="Specialist" value="Cardiology" />
          <Field label="City" value="Chennai" />
        </div>
        <div className="rounded-3xl bg-slate-950 p-5 text-white">
          <p className="text-xs font-black uppercase tracking-wide text-slate-400">Predicted cost range</p>
          <p className="mt-2 text-3xl font-black">{patientMode ? 'INR 4,500 - 6,000' : 'INR 1.2L - 1.5L'}</p>
          <p className="mt-2 text-xs font-semibold text-slate-400">Includes consultation, procedure, room, reports, and standard medicines.</p>
        </div>
      </div>
    </Card>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-black uppercase tracking-wide text-slate-400">{label}</span>
      <input className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-bold text-slate-700" defaultValue={value} />
    </label>
  )
}

function PrescriptionPanel() {
  return (
    <Card title="Digital Prescription Form" icon={<Pill className="h-5 w-5 text-blue-600" />}>
      <div className="space-y-3">
        <Field label="Medicine name" value="Ferrous Ascorbate 100mg" />
        <div className="grid grid-cols-2 gap-3">
          <Field label="Dosage" value="1-0-1" />
          <Field label="Timing" value="After food" />
        </div>
        <Field label="Follow-up date" value="20 May 2026" />
        <button className="w-full rounded-2xl bg-blue-600 px-4 py-3 text-sm font-black text-white">Save and Send</button>
      </div>
    </Card>
  )
}

function VideoNotesPanel() {
  return (
    <Card title="Video Consultation Notes" icon={<MessageSquareText className="h-5 w-5 text-blue-600" />}>
      <div className="mb-4 flex aspect-video items-center justify-center rounded-3xl bg-slate-900 text-white">
        <div className="text-center">
          <Video className="mx-auto h-8 w-8" />
          <p className="mt-2 text-sm font-black">Live consult - 12:45</p>
        </div>
      </div>
      <textarea
        className="h-28 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm font-semibold text-slate-700"
        defaultValue="Patient reports mild fatigue. BP normal. Continue monitoring symptoms and review CBC follow-up."
      />
    </Card>
  )
}

function OPTokenPanel({ queue }: { queue: QueueItem[] }) {
  return (
    <Card title="OP Token Management" icon={<Activity className="h-5 w-5 text-blue-600" />}>
      <div className="rounded-3xl bg-blue-600 p-5 text-white">
        <p className="text-xs font-black uppercase tracking-wide text-blue-100">Current token</p>
        <div className="mt-2 flex items-end justify-between">
          <p className="text-5xl font-black">#{queue[0]?.token}</p>
          <div className="text-right">
            <p className="text-xs text-blue-100">Next patient</p>
            <p className="text-lg font-black">#{queue[1]?.token}</p>
          </div>
        </div>
      </div>
      <div className="mt-4 space-y-3">
        {queue.slice(1).map((item) => (
          <div key={item.token} className={`rounded-2xl border p-3 ${item.urgent ? 'border-red-100 bg-red-50' : 'border-slate-100 bg-slate-50'}`}>
            <p className="text-sm font-black">#{item.token} {item.name}</p>
            <p className={`text-xs font-bold ${item.urgent ? 'text-red-600' : 'text-slate-500'}`}>{item.note}</p>
          </div>
        ))}
      </div>
    </Card>
  )
}

function RecoveryPanel({ patientMode = false }: { patientMode?: boolean }) {
  const metrics = [
    ['BP', '118/78', 'Normal'],
    ['Sugar', '95', 'Fasting'],
    ['Oxygen', '98%', 'Stable'],
    ['Temp', '98.4 F', 'No fever'],
    ['Sleep', '7.5 hrs', 'Good'],
    ['Pain', '2/10', 'Low'],
  ]
  return (
    <Card title={patientMode ? 'Health Progress Tracker' : 'Recovery Tracking Cards'} icon={<HeartPulse className="h-5 w-5 text-blue-600" />}>
      <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
        <div className="grid grid-cols-2 gap-3">
          {metrics.map(([label, value, note]) => (
            <div key={label} className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
              <p className="text-xs font-black uppercase tracking-wide text-slate-400">{label}</p>
              <p className="mt-1 text-xl font-black">{value}</p>
              <p className="text-xs font-bold text-emerald-600">{note}</p>
            </div>
          ))}
        </div>
        <div className="h-72 rounded-3xl border border-blue-100 bg-blue-50 p-4">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-black text-blue-900">Recovery score</p>
            <p className="text-2xl font-black text-blue-700">92/100</p>
          </div>
          <ResponsiveContainer width="100%" height="85%">
            <AreaChart data={recoveryData}>
              <defs>
                <linearGradient id="recoveryFill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.28} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#bfdbfe" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="day" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip />
              <Area dataKey="score" type="monotone" stroke="#2563eb" strokeWidth={3} fill="url(#recoveryFill)" />
              <Line dataKey="bp" type="monotone" stroke="#8b5cf6" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  )
}

function AppointmentPanel({ appointment, doctor }: { appointment: Appointment; doctor: Doctor }) {
  return (
    <Card title="Appointment Booking and OP Status" icon={<Calendar className="h-5 w-5 text-blue-600" />}>
      <div className="grid gap-4 lg:grid-cols-[1fr_0.8fr]">
        <div className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
          <div className="flex items-center gap-3">
            <img src={doctor.avatar} alt={doctor.name} className="h-14 w-14 rounded-2xl object-cover" />
            <div>
              <p className="font-black">{doctor.name}</p>
              <p className="text-xs font-semibold text-slate-500">{doctor.speciality} | {appointment.hospital}</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3">
            <Info label="Date" value="Today" />
            <Info label="Time" value={appointment.time} />
            <Info label="Status" value={appointment.status} />
          </div>
        </div>
        <div className="rounded-3xl bg-blue-600 p-5 text-white">
          <p className="text-xs font-black uppercase tracking-wide text-blue-100">Your token</p>
          <p className="mt-1 text-5xl font-black">#{appointment.token}</p>
          <p className="mt-3 text-sm font-semibold text-blue-50">Current OP token: #{appointment.currentToken}</p>
        </div>
      </div>
    </Card>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white p-3">
      <p className="text-xs font-black uppercase tracking-wide text-slate-400">{label}</p>
      <p className="text-sm font-black">{value}</p>
    </div>
  )
}

function UploadPanel() {
  return (
    <Card title="Report Upload" icon={<UploadCloud className="h-5 w-5 text-blue-600" />}>
      <div className="grid gap-4 md:grid-cols-[1fr_1fr]">
        <div className="rounded-3xl border-2 border-dashed border-blue-200 bg-blue-50 p-8 text-center">
          <UploadCloud className="mx-auto h-12 w-12 text-blue-600" />
          <p className="mt-3 font-black">Upload lab, scan, prescription, or bill</p>
          <p className="mt-1 text-xs font-semibold text-slate-500">PDF, JPG, PNG up to 10MB</p>
        </div>
        <div className="space-y-3">
          {['CBC_Blood_Test.pdf', 'ECG_Scan.jpg', 'Last_Prescription.pdf'].map((item) => (
            <div key={item} className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3">
              <FileText className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-black">{item}</p>
                <p className="text-xs font-semibold text-slate-500">Ready for AI analysis</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

function HospitalPanel({ doctors }: { doctors: Doctor[] }) {
  const hospitals = [
    {
      hospital: 'Apollo Hospitals',
      location: 'Greams Road, 2.5 km',
      rating: '4.8',
      match: '98% match',
      doctor: doctors[0],
    },
    {
      hospital: 'Fortis Malar Hospital',
      location: 'Adyar, 5.1 km',
      rating: '4.6',
      match: '92% match',
      doctor: doctors[2],
    },
  ]
  return (
    <Card title="AI Nearby Hospital Suggestion" icon={<Hospital className="h-5 w-5 text-violet-600" />} ai>
      <div className="grid gap-4 lg:grid-cols-2">
        {hospitals.map(({ hospital, location, rating, match, doctor }) => (
          <div key={hospital} className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
            <div className="mb-3 flex items-start justify-between">
              <div>
                <p className="font-black">{hospital}</p>
                <p className="flex items-center gap-1 text-xs font-semibold text-slate-500">
                  <MapPin className="h-3.5 w-3.5" />
                  {location}
                </p>
              </div>
              <span className="rounded-full bg-amber-50 px-2 py-1 text-xs font-black text-amber-700">{rating}</span>
            </div>
            <p className="text-sm font-semibold text-slate-600">
              {doctor.name} | {doctor.speciality} | {doctor.experience} | INR {doctor.fee}
            </p>
            <p className="mt-2 text-xs font-black text-violet-700">{match} based on uploaded report and symptoms</p>
          </div>
        ))}
      </div>
    </Card>
  )
}

function MedicineReminderPanel() {
  return (
    <Card title="Medicine Reminder" icon={<Pill className="h-5 w-5 text-blue-600" />}>
      <div className="space-y-3">
        {[
          ['Ferrous Ascorbate', '09:00 AM', '1 tablet', 'After food', true],
          ['Paracetamol', '02:00 PM', '1 tablet', 'After food', false],
          ['Vitamin C', '09:00 PM', '1 tablet', 'Before food', false],
        ].map(([name, time, dose, food, taken]) => (
          <div key={name as string} className={`rounded-2xl border p-3 ${taken ? 'border-emerald-100 bg-emerald-50' : 'border-slate-100 bg-slate-50'}`}>
            <div className="flex items-center justify-between">
              <p className="text-sm font-black">{name as string}</p>
              {taken ? <CheckCircle2 className="h-5 w-5 text-emerald-600" /> : <Clock className="h-5 w-5 text-amber-600" />}
            </div>
            <p className="mt-1 text-xs font-semibold text-slate-500">{time as string} | {dose as string} | {food as string}</p>
          </div>
        ))}
        <p className="rounded-2xl bg-red-50 p-3 text-xs font-black text-red-700">Missed medicine tracking: 1 missed dose yesterday</p>
      </div>
    </Card>
  )
}

function VideoConsultPanel() {
  return (
    <Card title="Video Consultation" icon={<Video className="h-5 w-5 text-blue-600" />}>
      <div className="rounded-3xl bg-slate-950 p-5 text-white">
        <p className="text-sm font-black">Dr. Aravind Kumar notes</p>
        <p className="mt-2 text-xs font-semibold text-slate-300">Continue medication, monitor fever, repeat CBC if fatigue persists.</p>
        <button className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-black">
          <Video className="h-4 w-4" />
          Join Call
        </button>
      </div>
    </Card>
  )
}

function BillPanel() {
  return (
    <Card title="Bill History and Payment Status" icon={<CreditCard className="h-5 w-5 text-blue-600" />}>
      <div className="space-y-3">
        <Bill name="Consultation Fee" amount="INR 1,000" status="Paid" />
        <Bill name="Lab Tests (CBC)" amount="INR 850" status="Pending" />
      </div>
    </Card>
  )
}

function Bill({ name, amount, status }: { name: string; amount: string; status: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-3">
      <div>
        <p className="text-sm font-black">{name}</p>
        <p className="text-xs font-semibold text-slate-500">{amount}</p>
      </div>
      <span className={`rounded-full px-3 py-1 text-xs font-black ${status === 'Paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
        {status}
      </span>
    </div>
  )
}

function EmergencyPanel({ patient }: { patient: Patient }) {
  return (
    <Card title="Emergency QR Health Card" icon={<QrCode className="h-5 w-5 text-red-600" />}>
      <div className="rounded-3xl bg-red-600 p-5 text-center text-white">
        <QrCode className="mx-auto h-28 w-28 rounded-3xl bg-white p-4 text-slate-950" />
        <p className="mt-4 text-xl font-black">{patient.name}</p>
        <p className="text-sm font-semibold text-red-100">{patient.id} | {patient.bloodGroup} | Allergy: {patient.allergies.join(', ')}</p>
        <p className="mt-3 text-xs font-semibold text-red-100">{patient.emergencyContact}</p>
      </div>
    </Card>
  )
}

function AuthShell({
  page,
  role,
  setRole,
  setPage,
  goDashboard,
}: {
  page: Page
  role: Role
  setRole: (role: Role) => void
  setPage: (page: Page) => void
  goDashboard: (role?: Role) => void
}) {
  const title =
    page === 'doctor-login'
      ? 'Doctor Login'
      : page === 'patient-login'
        ? 'Patient Login'
        : page === 'admin-login'
          ? 'Admin Login'
          : page === 'signup'
            ? 'Create Account'
            : page === 'patient-register'
              ? 'Patient Registration'
              : page === 'doctor-register'
                ? 'Doctor Registration'
                : page === 'forgot'
                  ? 'Forgot Password'
                  : page === 'otp'
                    ? 'OTP Verification'
                    : page === 'reset'
                      ? 'Reset Password'
                      : 'Main Login'

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-blue-100 bg-white shadow-soft lg:grid-cols-[1fr_1.15fr]">
        <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 p-8 text-white">
          <div className="mb-10 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-blue-600">
              <Activity className="h-7 w-7" />
            </div>
            <div>
              <p className="text-xl font-black">Medi Consult</p>
              <p className="text-xs font-semibold text-blue-100">Multi-Agent Swarm Diagnostic System</p>
            </div>
          </div>
          <h1 className="max-w-lg text-4xl font-black leading-tight">AI-first healthcare access for doctors, patients, and hospital admins.</h1>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {aiFeatures.map((feature) => (
              <div key={feature} className="rounded-2xl bg-white/15 p-3 text-xs font-black backdrop-blur">
                {feature}
              </div>
            ))}
          </div>
        </div>
        <div className="p-6 md:p-10">
          <div className="mb-8 flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-black uppercase tracking-wide text-blue-600">Secure access</p>
              <h2 className="mt-1 text-3xl font-black">{title}</h2>
            </div>
            {page !== 'login' && (
              <button onClick={() => setPage('login')} className="rounded-xl bg-slate-50 px-3 py-2 text-sm font-black text-slate-600">
                Back
              </button>
            )}
          </div>
          {page === 'login' && <MainLogin role={role} setRole={setRole} setPage={setPage} goDashboard={goDashboard} />}
          {page === 'doctor-login' && <DoctorLogin goDashboard={goDashboard} />}
          {page === 'patient-login' && <PatientLogin goDashboard={goDashboard} />}
          {page === 'admin-login' && <AdminLogin goDashboard={goDashboard} />}
          {page === 'signup' && <SignupSelection setPage={setPage} />}
          {page === 'patient-register' && <PatientRegister setPage={setPage} />}
          {page === 'doctor-register' && <DoctorRegister setPage={setPage} />}
          {page === 'forgot' && <ForgotPasswordForm setPage={setPage} />}
          {page === 'otp' && <OTPForm setPage={setPage} />}
          {page === 'reset' && <ResetForm setPage={setPage} />}
        </div>
      </div>
    </div>
  )
}

function MainLogin({
  role,
  setRole,
  setPage,
  goDashboard,
}: {
  role: Role
  setRole: (role: Role) => void
  setPage: (page: Page) => void
  goDashboard: (role?: Role) => void
}) {
  return (
    <div className="space-y-4">
      <AuthInput label="Username / Gmail / Application Number / ID" value={role === 'doctor' ? 'MC-DOC-8492' : role === 'admin' ? 'ADM-001' : 'PID-9921'} />
      <AuthInput label="Password" type="password" value="password123" />
      <div className="grid grid-cols-3 gap-2 rounded-2xl bg-slate-100 p-1">
        {(['patient', 'doctor', 'admin'] as const).map((item) => (
          <button
            key={item}
            onClick={() => setRole(item)}
            className={`rounded-xl py-2 text-sm font-black capitalize ${role === item ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500'}`}
          >
            {item}
          </button>
        ))}
      </div>
      <PrimaryButton onClick={() => goDashboard(role)}>Login to {role} dashboard</PrimaryButton>
      <div className="grid gap-2 sm:grid-cols-3">
        <SecondaryButton onClick={() => setPage('doctor-login')}>Doctor Login</SecondaryButton>
        <SecondaryButton onClick={() => setPage('patient-login')}>Patient Login</SecondaryButton>
        <SecondaryButton onClick={() => setPage('admin-login')}>Admin Login</SecondaryButton>
      </div>
      <div className="flex flex-wrap justify-between gap-3 text-sm font-bold">
        <button onClick={() => setPage('signup')} className="text-blue-600">Create account</button>
        <button onClick={() => setPage('forgot')} className="text-slate-500">Forgot password?</button>
      </div>
    </div>
  )
}

function DoctorLogin({ goDashboard }: { goDashboard: (role?: Role) => void }) {
  return (
    <div className="space-y-4">
      <AuthInput label="Doctor ID / Email" value="MC-DOC-8492" />
      <AuthInput label="Password" type="password" value="password123" />
      <AuthInput label="Hospital Code" value="APOLLO-CHN" />
      <PrimaryButton onClick={() => goDashboard('doctor')}>Login</PrimaryButton>
    </div>
  )
}

function PatientLogin({ goDashboard }: { goDashboard: (role?: Role) => void }) {
  return (
    <div className="space-y-4">
      <AuthInput label="Patient ID / Application Number / Gmail / Mobile Number" value="PID-9921" />
      <AuthInput label="Password" type="password" value="password123" />
      <PrimaryButton onClick={() => goDashboard('patient')}>Login</PrimaryButton>
    </div>
  )
}

function AdminLogin({ goDashboard }: { goDashboard: (role?: Role) => void }) {
  return (
    <div className="space-y-4">
      <AuthInput label="Admin ID" value="ADM-001" />
      <AuthInput label="Password" type="password" value="password123" />
      <AuthInput label="Hospital Code" value="APOLLO-CHN" />
      <PrimaryButton onClick={() => goDashboard('admin')}>Login</PrimaryButton>
    </div>
  )
}

function SignupSelection({ setPage }: { setPage: (page: Page) => void }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <ChoiceCard icon={<UserPlus />} title="Register as Patient" text="Book appointments, upload reports, track medicines." onClick={() => setPage('patient-register')} />
      <ChoiceCard icon={<Stethoscope />} title="Register as Doctor" text="Manage OP queue, prescriptions, and AI diagnosis." onClick={() => setPage('doctor-register')} />
    </div>
  )
}

function PatientRegister({ setPage }: { setPage: (page: Page) => void }) {
  return (
    <FormGrid>
      <AuthInput label="Full name" />
      <AuthInput label="Age" />
      <AuthInput label="Gender" />
      <AuthInput label="Mobile number" />
      <AuthInput label="Gmail" />
      <AuthInput label="Application number" />
      <AuthInput label="Password" type="password" />
      <AuthInput label="Confirm password" type="password" />
      <PrimaryButton onClick={() => setPage('patient-login')}>Create Patient Account</PrimaryButton>
    </FormGrid>
  )
}

function DoctorRegister({ setPage }: { setPage: (page: Page) => void }) {
  return (
    <FormGrid>
      <AuthInput label="Doctor name" />
      <AuthInput label="Doctor ID" />
      <AuthInput label="Specialization" />
      <AuthInput label="Hospital name" />
      <AuthInput label="Department" />
      <AuthInput label="Email" />
      <AuthInput label="Password" type="password" />
      <PrimaryButton onClick={() => setPage('doctor-login')}>Create Doctor Account</PrimaryButton>
    </FormGrid>
  )
}

function ForgotPasswordForm({ setPage }: { setPage: (page: Page) => void }) {
  return (
    <div className="space-y-4">
      <AuthInput label="Email / Mobile number / ID" />
      <PrimaryButton onClick={() => setPage('otp')}>Send OTP</PrimaryButton>
    </div>
  )
}

function OTPForm({ setPage }: { setPage: (page: Page) => void }) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-6 gap-2">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <input key={item} maxLength={1} className="h-14 rounded-2xl border border-slate-200 bg-slate-50 text-center text-xl font-black outline-none focus:border-blue-500" defaultValue={item === 1 ? '4' : ''} />
        ))}
      </div>
      <PrimaryButton onClick={() => setPage('reset')}>Verify</PrimaryButton>
    </div>
  )
}

function ResetForm({ setPage }: { setPage: (page: Page) => void }) {
  return (
    <div className="space-y-4">
      <AuthInput label="New password" type="password" />
      <AuthInput label="Confirm password" type="password" />
      <PrimaryButton onClick={() => setPage('login')}>Save Password</PrimaryButton>
    </div>
  )
}

function AuthInput({ label, value, type = 'text' }: { label: string; value?: string; type?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-black text-slate-700">{label}</span>
      <input type={type} defaultValue={value} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-blue-500" />
    </label>
  )
}

function PrimaryButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-full rounded-2xl bg-blue-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-blue-600/20">
      {children}
    </button>
  )
}

function SecondaryButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button onClick={onClick} className="rounded-2xl border border-blue-100 bg-white px-4 py-3 text-sm font-black text-blue-700">
      {children}
    </button>
  )
}

function ChoiceCard({ icon, title, text, onClick }: { icon: React.ReactNode; title: string; text: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="rounded-3xl border border-blue-100 bg-slate-50 p-6 text-left transition hover:border-blue-300">
      <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 [&>svg]:h-7 [&>svg]:w-7">{icon}</span>
      <p className="text-lg font-black">{title}</p>
      <p className="mt-1 text-sm font-semibold text-slate-500">{text}</p>
    </button>
  )
}

function FormGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 md:grid-cols-2 [&>button]:md:col-span-2">{children}</div>
}

function AdminDashboard({ data, setPage }: { data: BootstrapData; setPage: (page: Page) => void }) {
  return (
    <div className="space-y-6">
      <ProfileCard
        avatar={data.doctors[0].avatar}
        title="Apollo Hospitals Admin"
        subtitle="Hospital operations | Chennai | Admin ID ADM-001"
        badge="Admin console"
        icon={<ShieldCheck className="h-5 w-5" />}
        action="12 approvals"
      />
      <QuickActions
        setPage={setPage}
        items={[
          ['Verify Reports', FileText, 'ai-diagnosis'],
          ['Manage Doctors', Stethoscope, 'patient-search'],
          ['Manage Patients', Users, 'reports'],
          ['Billing', CreditCard, 'cost'],
          ['AI Risk Detection', Brain, 'ai-diagnosis'],
          ['Hospital Analytics', Building2, 'dashboard'],
        ]}
      />
      <div className="grid gap-4 md:grid-cols-4">
        <Metric title="Total Patients" value="1,240" icon={<Users />} />
        <Metric title="Active Doctors" value="45" icon={<Stethoscope />} tone="emerald" />
        <Metric title="Pending Reports" value="12" icon={<FileText />} tone="amber" />
        <Metric title="Revenue Today" value="INR 45.2k" icon={<IndianRupee />} tone="violet" />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <HospitalPanel doctors={data.doctors} />
        <AIReportPanel report={data.report} mode="doctor" />
        <CostEstimatorPanel />
        <BillPanel />
      </div>
    </div>
  )
}

function AIChat({ role }: { role: Role }) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      from: 'ai',
      text: role === 'doctor'
        ? 'Ask me to summarize reports, suggest specialists, estimate operation costs, or draft follow-up advice.'
        : 'Ask me to explain reports, find doctors, estimate costs, or track medicines.',
    },
  ])
  const [input, setInput] = useState('')

  const send = () => {
    if (!input.trim()) return
    const reply =
      input.toLowerCase().includes('cost')
        ? 'Estimated range depends on hospital tier, city, doctor speciality, procedure complexity, room type, and medicine package.'
        : input.toLowerCase().includes('report')
          ? 'The CBC report shows low hemoglobin and high WBC. This suggests anemia risk and possible infection. Please confirm with a clinician.'
          : 'AI swarm recommendation: review symptoms, reports, allergies, specialist fit, hospital availability, and follow-up tests before action.'
    setMessages([...messages, { from: 'user', text: input }, { from: 'ai', text: reply }])
    setInput('')
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open && (
        <div className="mb-3 w-[min(360px,calc(100vw-40px))] overflow-hidden rounded-3xl border border-violet-200 bg-white shadow-soft">
          <div className="flex items-center justify-between bg-violet-600 p-4 text-white">
            <p className="flex items-center gap-2 font-black"><Brain className="h-5 w-5" /> AI Swarm Chat</p>
            <button onClick={() => setOpen(false)} className="text-sm font-black">Close</button>
          </div>
          <div className="max-h-80 space-y-3 overflow-y-auto p-4">
            {messages.map((message, index) => (
              <div key={index} className={`rounded-2xl p-3 text-sm font-semibold ${message.from === 'ai' ? 'bg-violet-50 text-violet-900' : 'ml-8 bg-blue-600 text-white'}`}>
                {message.text}
              </div>
            ))}
          </div>
          <div className="flex gap-2 border-t border-slate-100 p-3">
            <input value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && send()} placeholder="Ask AI..." className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold outline-none" />
            <button onClick={send} className="rounded-2xl bg-violet-600 px-4 py-2 text-sm font-black text-white">Send</button>
          </div>
        </div>
      )}
      <button onClick={() => setOpen(!open)} className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-lg shadow-violet-600/30">
        <Brain className="h-7 w-7" />
      </button>
    </div>
  )
}
