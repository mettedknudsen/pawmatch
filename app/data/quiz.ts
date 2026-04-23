export const quizData = {
  species: [
    { id: 'species',
      question: 'Hvilket type dyr søger du?',
      field:'species',
      type: 'species',
      options: [
        {label: 'Kat', value:'cat', icon:'cat', classes:'bg-rust-500 hover:bg-rust-500/70 text-rust-900'},
        {label: 'Hund', value:'dog', icon:'dog', classes:'bg-bark-300 hover:bg-bark-300/70 text-bark-500'},
        {label: 'Kanin', value:'rabbit', icon:'rabbit', classes:'bg-salvie-300 hover:bg-salvie-300/70 text-salvie-700'},
        // {label: 'Det er ligegyldigt', value:null, icon:'i-lucide-x', classes: 'bg-neutral-200 hover:bg-neutral-200/70 text-neutral-500'}
      ]},
  ],
  shared: [
    {
      id: 'allergies',
      question: 'Har nogen i din husstand allergi?',
      field:'is_hypoallergenic',
      type: 'boolean',
      options: [
        {label: 'Ja', value:true, icon:'i-lucide-check'},
        {label: 'Nej', value:false, icon:'i-lucide-x'}
    ]},

    {
      id: 'children',
      question: 'Har du børn under 12 år?',
      field:'good_with_children',
      type: 'boolean',
      options: [
        {label: 'Ja', value:true, icon:'i-lucide-check'},
        {label: 'Nej', value:false, icon:'i-lucide-x'}
    ]},

    {
      id: 'other_animals',
      question: 'Har du andre dyr i forvejen?',
      field:'good_with_animals',
      type: 'boolean',
      options: [
        {label: 'Ja', value:true, icon:'i-lucide-check'},
        {label: 'Nej', value:false, icon:'i-lucide-x'}
    ]},

    {
      id:'shedding',
      question: 'Er du okay med meget pels i dit hjem?',
      field:'shedding_level',
      type: 'scale',
      options: [
        {label: 'Mindst muligt', value:1},
        {label: 'Lidt er ok', value:2},
        {label: 'Det er ligegyldigt', value:3},
    ]},

    {
      id:'handling',
      question: 'Hvordan er du med fysisk kontakt med kæledyr?',
      field:'handling_tolerance',
      type: 'scale',
      options: [
        {label: 'Kæler der, hvor det selv ligger', value: 1 },
        {label: 'Lidt nus og kontakt', value: 2 },
        {label: 'Putte, løfte og tæt kontakt', value: 3 },
      ]},

  ],
  dog: [
      {
        id: 'size',
        question: 'Hvilken størrelse hund passer dig?',
        field: 'size',
        type: 'enum',
        options: [
          {label:'Lille', value: 'small',description: 'Under 10 kg'},
          {label:'Mellem', value: 'medium', description: '10–25 kg'},
          {label:'Stor',value: 'large', description: 'Over 25 kg'},
        ]},

      {
        id: 'activity',
        question: 'Hvor aktiv er din hverdag?',
        field:'activity_level',
        type: 'scale',
        options: [
          {label:'Rolig', value: 1,description: 'Mest sofahygge'},
          {label:'Moderat', value: 2, description: 'Daglige gåture'},
          {label:'Aktiv',value: 3, description: 'Løb og sport'},
        ]},

        {
          id: 'space',
          question: 'Hvor meget plads har du?',
          field: 'space_needed',
          type: 'enum',
          options: [
            {label: 'Lille lejlighed', value: 'small' },
            {label: 'Mellemstor bolig',value: 'medium' },
            {label: 'Hus med have', value: 'large'},
          ]},
  ],
  cat: [
    {
      id: 'outdoor',
      question: 'Har katten adgang til at være udendørs?',
      field: 'needs_outdoor',
      type: 'boolean',
      options: [
        {label: 'Ja, have/altan', value: true },
        {label: 'Nej, indekat',value: false},
      ]},

    {
      id: 'independence',
      question: 'Hvad foretrækker du?',
      field: 'independence_level',
      type: 'scale',
      options: [
        {label: 'Selvstændig',value: 3 },
        {label: 'Lidt af begge', value: 2 },
        {label: 'Meget social', value: 1 },
      ]},

  ],
  rabbit: [
    {
      id: 'space',
      question: 'Hvor meget plads har du?',
      field: 'space_needed',
      type: 'enum',
      options: [
        {label: 'Lille lejlighed', value: 'small' },
        {label: 'Mellemstor bolig',value: 'medium' },
        {label: 'Hus med have', value: 'large'},
      ]},
  ]
}
