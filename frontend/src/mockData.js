export const mockApplications = [
  {
    id: "app_001", founder_id: "fdr_001", programme_id: "prog_001",
    company_name: "NutriAI Sdn Bhd", founder_name: "Aisha Binti Rahman",
    sector: "healthtech", stage: "pre-seed", score: 91, confidence: "high",
    reasoning: "Strong founding team with domain expertise in healthtech. Clear market validation with 2,000 active users pre-revenue. Sector aligns with CIP Catalyser digital health focus. Concern: burn rate high relative to pre-seed stage — recommend querying runway in interview.",
    flags: ["strong_traction", "burn_rate_concern"], status: "pending",
    mentor_suggestions: [
      { mentor_id: "mnt_001", name: "Ahmad Razali", match_score: 94, reason: "3 successful healthtech matches, sector specialist with 4 cohorts of experience." },
      { mentor_id: "mnt_002", name: "Dr Priya Nair", match_score: 88, reason: "Regulatory expertise for health apps. Available capacity (1/3 mentees)." },
      { mentor_id: "mnt_005", name: "Datuk Lim Chong", match_score: 71, reason: "Operations and scaling expertise but limited sector fit. Lower priority." }
    ],
    created_at: "2026-05-16T08:00:00Z"
  },
  { id: "app_002", founder_id: "fdr_002", programme_id: "prog_001", company_name: "PayNow Pay", founder_name: "Tan Wei Ming", sector: "fintech", stage: "seed", score: 87, confidence: "high", reasoning: "Experienced fintech team with prior exits. Strong B2C payment volume of RM 2M/month. Aligns with Cradle Fund fintech inclusion mandate.", flags: ["strong_traction", "strong_team"], status: "pending", mentor_suggestions: [], created_at: "2026-05-16T08:01:00Z" },
  { id: "app_003", founder_id: "fdr_003", programme_id: "prog_001", company_name: "AgriSense", founder_name: "Encik Hasrul Azman", sector: "agritech", stage: "pre-seed", score: 84, confidence: "medium", reasoning: "Experienced agricultural background with validated IoT solution. Strong B2B traction with 12 paying farm clients. Concern: small team of 3 may struggle to scale operations post-funding.", flags: ["b2b_traction", "team_size_concern"], status: "pending", mentor_suggestions: [], created_at: "2026-05-16T08:02:00Z" },
  { id: "app_004", founder_id: "fdr_004", programme_id: "prog_001", company_name: "EduLink", founder_name: "Siti Nurhaliza", sector: "edtech", stage: "seed", score: 79, confidence: "medium", reasoning: "Solid edtech product with 15 paying schools. Market validation strong. Concern: high competition in Malaysian edtech space — differentiation unclear from pitch.", flags: ["market_validated"], status: "pending", mentor_suggestions: [], created_at: "2026-05-16T08:03:00Z" },
  { id: "app_005", founder_id: "fdr_005", programme_id: "prog_001", company_name: "SwiftCargo", founder_name: "Lim Jia Hao", sector: "logistics", stage: "series-a", score: 74, confidence: "medium", reasoning: "Established logistics startup with regional ambitions. Strong revenue but late-stage applicant for pre-seed programme — may be misaligned.", flags: ["regional_strength"], status: "pending", mentor_suggestions: [], created_at: "2026-05-16T08:04:00Z" },
  { id: "app_006", founder_id: "fdr_006", programme_id: "prog_001", company_name: "ClinicLah", founder_name: "Dr Faridah Yusof", sector: "healthtech", stage: "pre-seed", score: 68, confidence: "low", reasoning: "Strong domain expertise but unclear go-to-market strategy. Team gap on tech side — only doctor on founding team. Recommend tech co-founder before next stage.", flags: ["team_gap"], status: "pending", mentor_suggestions: [], created_at: "2026-05-16T08:05:00Z" },
  { id: "app_007", founder_id: "fdr_007", programme_id: "prog_001", company_name: "MoneyMaster", founder_name: "Aaron Yap", sector: "fintech", stage: "pre-seed", score: 62, confidence: "low", reasoning: "Early-stage with limited validation. 200 users, no revenue yet. Crowded space without clear differentiation.", flags: ["early_stage_risk"], status: "pending", mentor_suggestions: [], created_at: "2026-05-16T08:06:00Z" },
  { id: "app_008", founder_id: "fdr_008", programme_id: "prog_001", company_name: "FarmFresh KL", founder_name: "Mohd Iqbal", sector: "agritech", stage: "pre-seed", score: 54, confidence: "low", reasoning: "Compelling mission but execution risk high. Solo founder, no domain experience, pre-revenue. Pitch lacks specifics on unit economics.", flags: ["early_stage_risk", "team_gap"], status: "pending", mentor_suggestions: [], created_at: "2026-05-16T08:07:00Z" },
  { id: "app_009", founder_id: "fdr_009", programme_id: "prog_001", company_name: "LearnEasy", founder_name: "Nurul Aiman", sector: "edtech", stage: "pre-seed", score: 48, confidence: "low", reasoning: "Vague pitch, no traction data provided, no team information. Application incomplete for proper evaluation.", flags: ["early_stage_risk"], status: "pending", mentor_suggestions: [], created_at: "2026-05-16T08:08:00Z" }
];

export const mockMentors = [
  { id: "mnt_001", name: "Ahmad Razali", role: "Healthtech specialist · ex-Cradle Fund", expertise: ["healthtech", "fundraising", "product"], sector: ["healthtech", "biotech"], capacity: 5, current_load: 4, success_rate: 0.75, cohort_count: 4, availability: "limited" },
  { id: "mnt_002", name: "Dr Priya Nair", role: "Medical devices · regulatory", expertise: ["medical devices", "regulatory", "go-to-market"], sector: ["healthtech", "medtech"], capacity: 3, current_load: 1, success_rate: 0.83, cohort_count: 6, availability: "available" },
  { id: "mnt_003", name: "Cik Aishah Hassan", role: "Fintech founder · ex-BigPay", expertise: ["fintech", "payments", "b2c"], sector: ["fintech"], capacity: 4, current_load: 2, success_rate: 0.80, cohort_count: 3, availability: "available" },
  { id: "mnt_004", name: "Encik Rajan", role: "Agritech · former Felda exec", expertise: ["agritech", "supply chain", "rural ops"], sector: ["agritech"], capacity: 4, current_load: 3, success_rate: 0.91, cohort_count: 5, availability: "limited" },
  { id: "mnt_005", name: "Datuk Lim Chong", role: "Scaling · operations · M&A", expertise: ["scaling", "operations", "logistics"], sector: ["logistics"], capacity: 4, current_load: 3, success_rate: 0.67, cohort_count: 8, availability: "limited" },
  { id: "mnt_006", name: "Puan Zarina", role: "Edtech · curriculum design", expertise: ["edtech", "b2b", "curriculum"], sector: ["edtech"], capacity: 5, current_load: 5, success_rate: 0.72, cohort_count: 7, availability: "full" }
];

export const mockMemory = {
  patterns: [
    { id: "pat_001", pattern_text: "3 healthtech startups matched with non-sector mentors dropped out in Cohort 11. Recommend prioritising sector-aligned mentors for healthtech applicants.", severity: "warning" },
    { id: "pat_002", pattern_text: "Startups from East Malaysia have 40% lower acceptance rate despite similar quality scores. Possible regional bias — review criteria weighting.", severity: "alert" },
    { id: "pat_003", pattern_text: "Single-founder applications graduate 28% less often than 2+ founder teams across last 3 cohorts. Flag solo-founder pitches for closer team review.", severity: "warning" }
  ],
  mentor_utilisation: [
    { mentor_id: "mnt_001", name: "Ahmad Razali", utilisation_pct: 80, recommendation: "Limit new assignments this cohort." },
    { mentor_id: "mnt_002", name: "Dr Priya Nair", utilisation_pct: 33, recommendation: "Available for 2 more matches." },
    { mentor_id: "mnt_003", name: "Cik Aishah Hassan", utilisation_pct: 50, recommendation: "Available for 2 more fintech matches." },
    { mentor_id: "mnt_004", name: "Encik Rajan", utilisation_pct: 75, recommendation: "Near capacity — assign carefully." },
    { mentor_id: "mnt_006", name: "Puan Zarina", utilisation_pct: 100, recommendation: "At capacity. No new assignments." }
  ]
};