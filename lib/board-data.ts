export const REGISTRATION_PIN = "2580";

export const patient = {
  name: "Bartholomew-Wellington, Alexandria M.",
  language: "Español",
  service: "Cardiothoracic Surgery • Room ICU-W-12B",
  discharge: "Fri, Sep. 26",
};

export const staff = [
  {
    name: "Dr. Wolfgang Mozart-Johannesen, MD",
    role: "Chief of Staff • Cardiothoracic Surgery",
    photo: "/media/staff-1.png",
  },
  {
    name: "Anastasia-Marie Hernandez-Rodriguez",
    role: "Registered Nurse, Charge",
    photo: "/media/staff-2.png",
  },
  {
    name: "Christopher J. Wellington-Smythe III",
    role: "Registered Nurse",
    photo: "/media/staff-3.png",
  },
  {
    name: "Priyanka L. Venkataramanan, DPT",
    role: "Physical Therapist, Acute Care",
    photo: "/media/staff-4.png",
  },
  {
    name: "Jean-Baptiste Beaumont-Dupré, RD",
    role: "Clinical Dietitian",
    photo: "/media/staff-5.png",
  },
  {
    name: "Jean-Baptiste Beaumont-Dupré, RD",
    role: "Clinical Dietitian",
    photo: "/media/staff-6.png",
  },
  {
    name: "Jean-Baptiste Beaumont-Dupré, RD",
    role: "Clinical Dietitian",
    photo: "/media/staff-7.png",
  },
];

export const carePartner = {
  name: "Maria-Elena G. Hernandez-Rodriguez",
  detail: "Spouse • +1 (555) 867-5309 x4421",
};

export const schedule = [
  {
    part: "Morning",
    muted: false,
    items: [
      {
        title: "Physical therapy — gait training",
        when: "11:30 AM",
        muted: false,
      },
    ],
  },
  {
    part: "Afternoon",
    muted: true,
    items: [
      {
        title: "Interdisciplinary family conference",
        when: "12:00 PM – 1:30 PM",
        muted: true,
      },
      {
        title: "Lab draw — complete metabolic panel",
        when: "Approximately 2:00 PM",
        muted: true,
      },
    ],
  },
  {
    part: "Evening",
    muted: true,
    items: [{ title: "Quiet hours", when: "9:00 PM", muted: true }],
  },
];

export const goals = [
  "Ambulate 150 ft with walker, standby assist ×2",
  "Sit up in chair for all meals with no pain increase",
];

export const activities = ["Activity 1", "Activity 2"];

export const alerts = [
  "Fall risk — high",
  "Severe latex allergy",
  "Contact isolation — MRSA",
];

export const restrictions = [
  "NPO after midnight except meds",
  "LLE non-weight bearing",
  "Oxygen with ambulation",
];

export const therapyOrders = ["Therapy 1", "Therapy 2"];

export const pain = {
  threshold: 7,
  lastScore: 9,
  lastAssessed: "Sun, May 3 • 9:35 PM",
};

export const drawGuidance = [
  "GetWell does not recommend the use of a stylus",
  "Use one finger when calibrating and drawing",
  "Keep other fingers and palm lifted away from screen",
  "Use the X icon to minimize the draw box",
  "Scan the QR Code to draw with your mobile device",
  "Certain controls like dimming and ON/OFF cannot be used while the draw box is expanded",
];

export const inkColors = ["#2A1059", "#1A1A1A", "#795DE9", "#E24B4B", "#2F6FED", "#1F8A4C"];

export const lineWeights = [0.008, 0.014, 0.022, 0.034];
