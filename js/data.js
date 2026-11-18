/* ====================================================================
   1. INITIAL DATA & LOCAL DATABASE SIMULATION
   ==================================================================== */

// Sample Pharmaceutical Catalog (Vademécum)
let medicines = [
  {
    id: "MED-01",
    name: "Ibupirac 600 mg",
    generic: "Ibuprofeno 600 mg",
    barcode: "779123456001",
    lab: "Pfizer / Roemmers",
    presentation: "Caja x 20 comprimidos",
    price: 4850,
    category: "Analgésico",
    condition: "libre", // libre, receta, archivada
    stock: 32,
  },
  {
    id: "MED-02",
    name: "Amoxidal 500 mg",
    generic: "Amoxicilina 500 mg",
    barcode: "779123456002",
    lab: "Roemmers",
    presentation: "Caja x 16 cápsulas",
    price: 7200,
    category: "Antibiótico",
    condition: "receta",
    stock: 8,
  },
  {
    id: "MED-03",
    name: "Paracetamol Raffo 1g",
    generic: "Paracetamol 1000 mg",
    barcode: "779123456003",
    lab: "Raffo",
    presentation: "Caja x 30 comprimidos",
    price: 5400,
    category: "Analgésico",
    condition: "libre",
    stock: 45,
  },
  {
    id: "MED-04",
    name: "Lotrial 10 mg",
    generic: "Enalapril 10 mg",
    barcode: "779123456004",
    lab: "Roemmers",
    presentation: "Caja x 30 comprimidos",
    price: 6100,
    category: "Cardiovascular",
    condition: "receta",
    stock: 19,
  },
  {
    id: "MED-05",
    name: "Losacor 50 mg",
    generic: "Losartán Potásico 50 mg",
    barcode: "779123456005",
    lab: "Bagó",
    presentation: "Caja x 30 comprimidos",
    price: 7950,
    category: "Cardiovascular",
    condition: "receta",
    stock: 14,
  },
  {
    id: "MED-06",
    name: "Rivotril 0.5 mg",
    generic: "Clonazepam 0.5 mg",
    barcode: "779123456006",
    lab: "Roche",
    presentation: "Caja x 30 comprimidos",
    price: 6800,
    category: "Psicotrópico",
    condition: "archivada",
    stock: 11,
  },
  {
    id: "MED-07",
    name: "Gaster 20 mg",
    generic: "Omeprazol 20 mg",
    barcode: "779123456007",
    lab: "Casasco",
    presentation: "Caja x 28 cápsulas",
    price: 5200,
    category: "Gastrointestinal",
    condition: "libre",
    stock: 2, // Low stock demo
  },
  {
    id: "MED-08",
    name: "Ventolin Inhalador",
    generic: "Salbutamol 100 mcg",
    barcode: "779123456008",
    lab: "GSK",
    presentation: "Aerosol 200 dosis",
    price: 11300,
    category: "Respiratorio",
    condition: "receta",
    stock: 0, // Zero stock demo
  },
  {
    id: "MED-09",
    name: "Actron 400 Rápida Acción",
    generic: "Ibuprofeno 400 mg cápsula blanda",
    barcode: "779123456009",
    lab: "Bayer",
    presentation: "Caja x 10 cápsulas blandas",
    price: 3600,
    category: "Analgésico",
    condition: "libre",
    stock: 50,
  },
  {
    id: "MED-10",
    name: "Optamox Dúo 1g",
    generic: "Amoxicilina + Ác. Clavulánico",
    barcode: "779123456010",
    lab: "Roemmers",
    presentation: "Caja x 14 comprimidos",
    price: 14800,
    category: "Antibiótico",
    condition: "receta",
    stock: 12,
  },
  {
    id: "MED-11",
    name: "Sertal Compuesto",
    generic: "Propinoxato + Clonixinato de Lisina",
    barcode: "779123456011",
    lab: "Roemmers",
    presentation: "Caja x 20 comprimidos",
    price: 4900,
    category: "Analgésico",
    condition: "libre",
    stock: 26,
  },
  {
    id: "MED-12",
    name: "Taural Plus",
    generic: "Ranitidina + Magaldrato",
    barcode: "779123456012",
    lab: "Roemmers",
    presentation: "Caja x 30 comprimidos",
    price: 6300,
    category: "Gastrointestinal",
    condition: "libre",
    stock: 1, // Low stock demo
  }
];

// Reference Date in system: 2026-10-15
const SYSTEM_DATE = new Date("2026-10-15T00:00:00");

// Batches (Lotes) with realistic dates
let batches = [
  {
    id: "LOT-001",
    drugId: "MED-01",
    drugName: "Ibupirac 600 mg",
    batchCode: "LOT-IBU-9402",
    expDate: "2027-06-30",
    units: 20,
    initialUnits: 50,
    supplier: "Droguería del Sud"
  },
  {
    id: "LOT-002",
    drugId: "MED-01",
    drugName: "Ibupirac 600 mg",
    batchCode: "LOT-IBU-8812",
    expDate: "2026-11-08", // In 24 days -> Próximo a vencer!
    units: 12,
    initialUnits: 30,
    supplier: "Droguería Monroe"
  },
  {
    id: "LOT-003",
    drugId: "MED-02",
    drugName: "Amoxidal 500 mg",
    batchCode: "LOT-AMX-7104",
    expDate: "2026-10-28", // In 13 days -> Próximo a vencer!
    units: 8,
    initialUnits: 25,
    supplier: "Suizo Argentina"
  },
  {
    id: "LOT-004",
    drugId: "MED-03",
    drugName: "Paracetamol Raffo 1g",
    batchCode: "LOT-PAR-5541",
    expDate: "2026-09-15", // Already expired in Sept 2026!
    units: 5,
    initialUnits: 20,
    supplier: "Droguería del Sud"
  },
  {
    id: "LOT-005",
    drugId: "MED-03",
    drugName: "Paracetamol Raffo 1g",
    batchCode: "LOT-PAR-9982",
    expDate: "2027-12-31",
    units: 40,
    initialUnits: 40,
    supplier: "Droguería del Sud"
  },
  {
    id: "LOT-006",
    drugId: "MED-04",
    drugName: "Lotrial 10 mg",
    batchCode: "LOT-LOT-6321",
    expDate: "2026-11-12", // In 28 days -> Próximo a vencer!
    units: 19,
    initialUnits: 30,
    supplier: "COFALOZA"
  },
  {
    id: "LOT-007",
    drugId: "MED-05",
    drugName: "Losacor 50 mg",
    batchCode: "LOT-LOS-4109",
    expDate: "2027-04-15",
    units: 14,
    initialUnits: 20,
    supplier: "Suizo Argentina"
  },
  {
    id: "LOT-008",
    drugId: "MED-06",
    drugName: "Rivotril 0.5 mg",
    batchCode: "LOT-RIV-0922",
    expDate: "2027-08-20",
    units: 11,
    initialUnits: 15,
    supplier: "Droguería del Sud"
  },
  {
    id: "LOT-009",
    drugId: "MED-07",
    drugName: "Gaster 20 mg",
    batchCode: "LOT-GAS-3310",
    expDate: "2027-03-10",
    units: 2,
    initialUnits: 25,
    supplier: "Droguería Monroe"
  },
  {
    id: "LOT-010",
    drugId: "MED-09",
    drugName: "Actron 400 Rápida Acción",
    batchCode: "LOT-ACT-8291",
    expDate: "2028-01-15",
    units: 50,
    initialUnits: 60,
    supplier: "Droguería del Sud"
  },
  {
    id: "LOT-011",
    drugId: "MED-10",
    drugName: "Optamox Dúo 1g",
    batchCode: "LOT-OPT-4822",
    expDate: "2027-09-05",
    units: 12,
    initialUnits: 20,
    supplier: "COFALOZA"
  },
  {
    id: "LOT-012",
    drugId: "MED-11",
    drugName: "Sertal Compuesto",
    batchCode: "LOT-SER-1190",
    expDate: "2027-11-20",
    units: 26,
    initialUnits: 30,
    supplier: "Droguería del Sud"
  }
];

// Seeded Sales History for Today
let salesHistory = [
  {
    id: "TCK-000427",
    time: "14:52",
    itemsDesc: "Ibupirac 600mg x 1, Sertal Compuesto x 1",
    payment: "Efectivo",
    clientType: "Particular",
    subtotal: 9750,
    discount: 0,
    total: 9750,
  },
  {
    id: "TCK-000426",
    time: "14:18",
    itemsDesc: "Amoxidal 500mg x 2",
    payment: "Mercado Pago",
    clientType: "PAMI",
    subtotal: 14400,
    discount: 5760,
    total: 8640,
  },
  {
    id: "TCK-000425",
    time: "13:45",
    itemsDesc: "Losacor 50mg x 1, Lotrial 10mg x 1",
    payment: "Tarjeta D/C",
    clientType: "OSDE",
    subtotal: 14050,
    discount: 2810,
    total: 11240,
  },
  {
    id: "TCK-000424",
    time: "12:30",
    itemsDesc: "Optamox Dúo 1g x 1",
    payment: "Mercado Pago",
    clientType: "Particular",
    subtotal: 14800,
    discount: 0,
    total: 14800,
  },
  {
    id: "TCK-000423",
    time: "11:15",
    itemsDesc: "Paracetamol Raffo 1g x 2",
    payment: "Efectivo",
    clientType: "Particular",
    subtotal: 10800,
    discount: 1080,
    total: 9720,
  }
];

// Current Application State
let cart = [];
let selectedPaymentMethod = 'cash'; // 'cash', 'qr', 'card'
let currentPosCategoryFilter = 'all';
let currentBatchFilter = 'all';
let soundEnabled = true;

// Currency Formatter (Argentine Peso)
const formatARS = (amount) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(amount);
};
