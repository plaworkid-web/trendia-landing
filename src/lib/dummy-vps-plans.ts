export type VpsPlanType = "general" | "compute" | "memory" | "gpu";

export interface DummyVpsPlan {
  id: string;
  name: string;
  type: VpsPlanType;
  description: { id: string; en: string };
  vcpu: number;
  ramGb: number;
  storageGb: number;
  storageType: "NVMe SSD";
  bandwidthTb: number;
  networkGbps: number;
  region: string;
  os: string[];
  monthlyIdr: number;
  featured: boolean;
}

export const dummyVpsPlans: DummyVpsPlan[] = [
  {
    id: "vps-starter-1",
    name: "Starter 1",
    type: "general",
    description: { id: "Untuk website pribadi, bot, dan aplikasi ringan.", en: "For personal sites, bots, and lightweight applications." },
    vcpu: 1,
    ramGb: 1,
    storageGb: 25,
    storageType: "NVMe SSD",
    bandwidthTb: 1,
    networkGbps: 1,
    region: "Jakarta",
    os: ["Ubuntu", "Debian", "AlmaLinux"],
    monthlyIdr: 55_000,
    featured: false,
  },
  {
    id: "vps-starter-2",
    name: "Starter 2",
    type: "general",
    description: { id: "Untuk landing page, API kecil, dan development.", en: "For landing pages, small APIs, and development." },
    vcpu: 2,
    ramGb: 2,
    storageGb: 50,
    storageType: "NVMe SSD",
    bandwidthTb: 2,
    networkGbps: 1,
    region: "Jakarta",
    os: ["Ubuntu", "Debian", "AlmaLinux"],
    monthlyIdr: 95_000,
    featured: false,
  },
  {
    id: "vps-growth-4",
    name: "Growth 4",
    type: "general",
    description: { id: "Pilihan seimbang untuk aplikasi produksi dan database.", en: "A balanced choice for production applications and databases." },
    vcpu: 2,
    ramGb: 4,
    storageGb: 80,
    storageType: "NVMe SSD",
    bandwidthTb: 4,
    networkGbps: 2,
    region: "Jakarta",
    os: ["Ubuntu", "Debian", "AlmaLinux", "Rocky Linux"],
    monthlyIdr: 165_000,
    featured: true,
  },
  {
    id: "vps-business-8",
    name: "Business 8",
    type: "general",
    description: { id: "Untuk e-commerce, SaaS, dan workload bisnis.", en: "For e-commerce, SaaS, and business workloads." },
    vcpu: 4,
    ramGb: 8,
    storageGb: 160,
    storageType: "NVMe SSD",
    bandwidthTb: 6,
    networkGbps: 2,
    region: "Jakarta",
    os: ["Ubuntu", "Debian", "AlmaLinux", "Rocky Linux"],
    monthlyIdr: 315_000,
    featured: false,
  },
  {
    id: "vps-compute-c4",
    name: "Compute C4",
    type: "compute",
    description: { id: "CPU berdedikasi untuk build, worker, dan komputasi intensif.", en: "Dedicated CPU for builds, workers, and compute-intensive tasks." },
    vcpu: 4,
    ramGb: 8,
    storageGb: 120,
    storageType: "NVMe SSD",
    bandwidthTb: 6,
    networkGbps: 5,
    region: "Singapore",
    os: ["Ubuntu", "Debian", "Rocky Linux"],
    monthlyIdr: 495_000,
    featured: false,
  },
  {
    id: "vps-memory-m16",
    name: "Memory M16",
    type: "memory",
    description: { id: "RAM besar untuk database, cache, dan analitik.", en: "Extra memory for databases, caching, and analytics." },
    vcpu: 4,
    ramGb: 16,
    storageGb: 240,
    storageType: "NVMe SSD",
    bandwidthTb: 8,
    networkGbps: 5,
    region: "Singapore",
    os: ["Ubuntu", "Debian", "AlmaLinux"],
    monthlyIdr: 695_000,
    featured: false,
  },
  {
    id: "vps-performance-16",
    name: "Performance 16",
    type: "compute",
    description: { id: "Performa tinggi untuk layanan dengan trafik besar.", en: "High performance for services with heavy traffic." },
    vcpu: 8,
    ramGb: 16,
    storageGb: 320,
    storageType: "NVMe SSD",
    bandwidthTb: 10,
    networkGbps: 5,
    region: "Jakarta",
    os: ["Ubuntu", "Debian", "AlmaLinux", "Rocky Linux"],
    monthlyIdr: 895_000,
    featured: true,
  },
  {
    id: "vps-gpu-t4",
    name: "GPU T4",
    type: "gpu",
    description: { id: "NVIDIA T4 untuk inference AI dan pemrosesan visual.", en: "NVIDIA T4 for AI inference and visual processing." },
    vcpu: 8,
    ramGb: 32,
    storageGb: 400,
    storageType: "NVMe SSD",
    bandwidthTb: 10,
    networkGbps: 10,
    region: "Singapore",
    os: ["Ubuntu + CUDA"],
    monthlyIdr: 2_950_000,
    featured: false,
  },
];
