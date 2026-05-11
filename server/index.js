import express from 'express'
import cors from 'cors'

const app = express()
const port = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

const patients = [
  {
    id: 'PID-9921',
    name: 'Priya Sharma',
    age: 28,
    gender: 'Female',
    bloodGroup: 'O+',
    city: 'Chennai',
    allergies: ['Penicillin'],
    avatar: 'https://i.pravatar.cc/150?img=5',
    conditions: ['Mild Hypertension'],
    emergencyContact: 'Rahul Sharma +91 98765 12345',
  },
]

const doctors = [
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
]

const appointments = [
  {
    id: 'APT-1042',
    patientId: 'PID-9921',
    doctorId: 'MC-DOC-8492',
    token: 45,
    currentToken: 42,
    time: '10:30 AM',
    status: 'Waiting',
    hospital: 'Apollo Hospitals, Chennai',
    type: 'In-person OP',
  },
]

const reports = [
  {
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
]

const queue = [
  { token: 42, name: 'Priya Sharma', note: '28F - follow-up consult' },
  { token: 43, name: 'Suresh Kumar', note: 'Chest pain - emergency priority', urgent: true },
  { token: 44, name: 'Rahul Verma', note: 'General checkup' },
  { token: 45, name: 'Anitha Rao', note: 'Post-scan review' },
]

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'medi-consult-api' })
})

app.post('/api/auth/login', (req, res) => {
  const { role = 'patient' } = req.body
  res.json({ token: `demo-${role}-token`, role })
})

app.get('/api/bootstrap', (_req, res) => {
  res.json({
    patient: patients[0],
    doctors,
    appointment: appointments[0],
    report: reports[0],
    queue,
    patients,
    appointments,
    reports,
  })
})

app.get('/api/patients/:id', (req, res) => {
  const patient = patients.find((item) => item.id === req.params.id)
  if (!patient) return res.status(404).json({ message: 'Patient not found' })
  res.json(patient)
})

app.post('/api/appointments', (req, res) => {
  const nextToken = Math.max(...appointments.map((item) => item.token)) + 1
  const appointment = {
    id: `APT-${Date.now()}`,
    patientId: req.body.patientId || 'PID-9921',
    doctorId: req.body.doctorId || 'MC-DOC-8492',
    token: nextToken,
    currentToken: 42,
    time: req.body.time || '10:30 AM',
    status: 'Waiting',
    type: req.body.type || 'In-person OP',
  }
  appointments.push(appointment)
  res.status(201).json(appointment)
})

app.post('/api/reports/analyze', (req, res) => {
  res.json({
    reportId: req.body.reportId || 'RPT-CBC-001',
    summary: reports[0].aiSummary,
    risk: 'Moderate',
    recommendations: [
      'Order serum ferritin and peripheral smear.',
      'Use a non-penicillin antibiotic if infection is clinically confirmed.',
      'Repeat CBC in two weeks.',
    ],
  })
})

app.listen(port, () => {
  console.log(`Medi Consult API running on http://localhost:${port}`)
})
