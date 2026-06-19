export type Language = 'tr' | 'en'

export const translations = {
  tr: {
    // Mevkiler
    ST: 'SNT', LW: 'SLK', RW: 'SĞK', LF: 'SLF', CF: 'MF', RF: 'SĞF',
    CAM: 'MOO', LM: 'SLO', CM: 'MO', RM: 'SĞO', CDM: 'MDO',
    LWB: 'SLKB', LB: 'SLB', CB: 'STP', RB: 'SĞB', RWB: 'SĞKB', GK: 'KL',
    // Arayüz
    loungeTitle: 'VIP Draft Salonu',
    rollButton: 'Kadro Çevir',
    chemistry: 'Kimya',
    rating: 'Genel',
    manager: 'Teknik Direktör',
    captain: 'Kaptan',
    mvp: 'MVP',
    masterPurge: 'Temizle',
    tacticalSystem: 'Taktik Diziliş',
    grandDesignations: 'Görevler',
    draftPlaceholder: 'Kaptan ve MVP atamak için oyuncu seç.',
    vipSeeded: 'VIP Eşleşme',
    simulate: 'Simüle Et',
    export: 'Paylaş',
    unlockTournament: 'Turnuvayı açmak için 11 oyuncuyu tamamla.',
  },
  en: {
    // Positions
    ST: 'ST', LW: 'LW', RW: 'RW', LF: 'LF', CF: 'CF', RF: 'RF',
    CAM: 'CAM', LM: 'LM', CM: 'CM', RM: 'RM', CDM: 'CDM',
    LWB: 'LWB', LB: 'LB', CB: 'CB', RB: 'RB', RWB: 'RWB', GK: 'GK',
    // Interface
    loungeTitle: 'Grand VIP Draft Lounge',
    rollButton: 'Roll Pool',
    chemistry: 'Chemistry',
    rating: 'OVR',
    manager: 'Manager',
    captain: 'Captain',
    mvp: 'MVP',
    masterPurge: 'Master Purge',
    tacticalSystem: 'Tactical System',
    grandDesignations: 'Grand Designations',
    draftPlaceholder: 'Draft players to crown a Captain and MVP.',
    vipSeeded: 'VIP Seeded Matchmaking',
    simulate: 'Simulate',
    export: 'Export',
    unlockTournament: 'Complete all 11 slots to unlock the tournament.',
  },
}
