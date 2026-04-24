export const quizData = {
  species: [
    { id: 'species',
      question: 'Hvilket type dyr søger du?',
      field:'species',
      type: 'species',
      options: [
        {label: 'Kat', value:'cat', icon:'cat', classes:'bg-rust-500 hover:bg-rust-500/70 text-rust-900'},
        {label: 'Hund', value:'dog', icon:'dog', classes:'bg-bark-300 active:bg--bark-300 hover:bg-bark-300/70 text-bark-500'},
        {label: 'Kanin', value:'rabbit', icon:'rabbit', classes:'bg-salvie-300 hover:bg-salvie-300/70 text-salvie-700'},
        {label: 'Det er ligegyldigt', value:'all', icon:'i-lucide-x', classes: 'bg-neutral-300 hover:bg-neutral-200/70 text-neutral-500'}
      ]},
  ],
  shared: [
    {
      id: 'allergies',
      question: 'Har nogen i din husstand allergi?',
      field:'is_hypoallergenic',
      type: 'boolean',
      options: [
        {label: 'Ja', value:true, icon:'i-lucide-check', classes: 'bg-salvie-700 text-white active:bg-salvie-900 hover:bg-salvie-900'},
        {label: 'Nej', value:false, icon:'i-lucide-x', classes: 'bg-rust-900 text-white active:bg-rust-900-hover hover:bg-rust-900-hover'}
    ]},

    {
      id: 'children',
      question: 'Har du børn under 12 år?',
      field:'good_with_children',
      type: 'boolean',
      options: [
        {label: 'Ja', value:true, icon:'i-lucide-check', classes: 'bg-salvie-700 text-white active:bg-salvie-900 hover:bg-salvie-900'},
        {label: 'Nej', value:false, icon:'i-lucide-x', classes: 'bg-rust-900 text-white active:bg-rust-900-hover hover:bg-rust-900-hover'}
    ]},

    {
      id: 'other_animals',
      question: 'Har du andre dyr i forvejen?',
      field:'good_with_animals',
      type: 'boolean',
      options: [
        {label: 'Ja', value:true, icon:'i-lucide-check', classes: 'bg-salvie-700 text-white active:bg-salvie-900 hover:bg-salvie-900'},
        {label: 'Nej', value:false, icon:'i-lucide-x', classes: 'bg-rust-900 text-white active:bg-rust-900-hover hover:bg-rust-900-hover'}
    ]},

    {
      id:'shedding',
      question: 'Er du okay med meget pels i dit hjem?',
      field:'shedding_level',
      type: 'scale',
      options: [
        {label: 'Mindst muligt', value:1, classes: 'active:bg--bark-300 hover:bg-bark-300 bg-sand text-bark-900'},
        {label: 'Lidt er ok', value:2, classes: 'bg-terrakotta active:bg-terrakotta-hover hover:bg-terrakotta-hover text-white'},
        {label: 'Det er ligegyldigt', value:3, classes: 'bg-bark-500 active:bg-bark-900 hover:bg-bark-900  text-white'},
    ]},

    {
      id:'handling',
      question: 'Hvordan er du med fysisk kontakt med kæledyr?',
      field:'handling_tolerance',
      mode: 'requirement',
      type: 'scale',
      options: [
        {label: 'Kæler der, hvor det selv ligger', value: 1 , classes: 'active:bg--bark-300 hover:bg-bark-300 bg-sand text-bark-900'},
        {label: 'Lidt nus og kontakt', value: 2 , classes: 'bg-terrakotta active:bg-terrakotta-hover hover:bg-terrakotta-hover text-white'},
        {label: 'Putte, løfte og tæt kontakt', value: 3 , classes: 'bg-bark-500 active:bg-bark-900 hover:bg-bark-900  text-white'},
      ]},

  ],
  dog: [
      {
        id: 'size',
        question: 'Hvilken størrelse hund passer dig?',
        field: 'size',
        type: 'enum',
        options: [
          {label:'Lille', value: 'small',description: 'Under 10 kg', classes: 'active:bg--bark-300 hover:bg-bark-300 bg-sand text-bark-900'},
          {label:'Mellem', value: 'medium', description: '10–25 kg', classes: 'bg-terrakotta active:bg-terrakotta-hover hover:bg-terrakotta-hover text-white'},
          {label:'Stor',value: 'large', description: 'Over 25 kg', classes: 'bg-bark-500 active:bg-bark-900 hover:bg-bark-900  text-white'},
        ]},

      {
        id: 'activity',
        question: 'Hvor aktiv er din hverdag?',
        field:'activity_level',
        mode: 'requirement',
        type: 'scale',
        options: [
          {label:'Rolig', value: 1,description: 'Mest sofahygge', classes: 'active:bg--bark-300 hover:bg-bark-300 bg-sand text-bark-900'},
          {label:'Moderat', value: 2, description: 'Daglige gåture', classes: 'bg-terrakotta active:bg-terrakotta-hover hover:bg-terrakotta-hover text-white'},
          {label:'Aktiv',value: 3, description: 'Løb og sport', classes: 'bg-bark-500 active:bg-bark-900 hover:bg-bark-900  text-white'},
        ]},

        {
          id: 'space',
          question: 'Hvor meget plads har du?',
          field: 'space_needed',
          mode: 'requirement',
          type: 'enum',
          options: [
            {label: 'Lille lejlighed', value: 'small' , classes: 'active:bg--bark-300 hover:bg-bark-300 bg-sand text-bark-900'},
            {label: 'Mellemstor bolig',value: 'medium' , classes: 'bg-terrakotta active:bg-terrakotta-hover hover:bg-terrakotta-hover text-white'},
            {label: 'Hus med have', value: 'large', classes: 'bg-bark-500 active:bg-bark-900 hover:bg-bark-900  text-white'},
          ]},
  ],
  cat: [
    {
      id: 'outdoor',
      question: 'Har katten adgang til at være udendørs?',
      field: 'needs_outdoor',
      type: 'boolean',
      mode: 'requirement',
      options: [
        {label: 'Ja, have/altan', value: true , classes: 'bg-salvie-700 text-white active:bg-salvie-900 hover:bg-salvie-900'},
        {label: 'Nej, indekat',value: false, classes: 'bg-rust-900 text-white active:bg-rust-900-hover hover:bg-rust-900-hover'},
      ]},

    {
      id: 'independence',
      question: 'Hvad foretrækker du?',
      field: 'independence_level',
      type: 'scale',
      options: [
        {label: 'Selvstændig',value: 3 , classes: 'active:bg--bark-300 hover:bg-bark-300 bg-sand text-bark-900'},
        {label: 'Lidt af begge', value: 2 , classes: 'bg-terrakotta active:bg-terrakotta-hover hover:bg-terrakotta-hover text-white'},
        {label: 'Meget social', value: 1 , classes: 'bg-bark-500 active:bg-bark-900 hover:bg-bark-900  text-white'},
      ]},
  ],
  rabbit: [
    {
      id: 'space',
      question: 'Hvor meget plads har du?',
      field: 'space_needed',
      type: 'enum',
      mode: 'requirement',
      options: [
        {label: 'Lille lejlighed', value: 'small' , classes: 'active:bg--bark-300 hover:bg-bark-300 bg-sand text-bark-900'},
        {label: 'Mellemstor bolig',value: 'medium' , classes: 'bg-terrakotta active:bg-terrakotta-hover hover:bg-terrakotta-hover text-white'},
        {label: 'Hus med have', value: 'large', classes: 'bg-bark-500 active:bg-bark-900 hover:bg-bark-900  text-white'},
      ]},
  ]
}
