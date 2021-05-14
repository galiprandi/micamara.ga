export interface iOnlineProduct {
    id: { $t: string }
    gsx$act: { $t: string }
    gsx$web: { $t: string }
    gsx$stock: { $t: string }
    gsx$d: { $t: string }
    gsx$producto: { $t: string }
    gsx$pvp: { $t: string }
    gsx$cuotas: { $t: string }
    gsx$img: { $t: string }
    gsx$marca: { $t: string }
    gsx$categoria: { $t: string }
    gsx$rubro: { $t: string }
    gsx$desc: { $t: string }
}

export interface iProduct {
    id: string
    pid: string
    name: string
    price: string
    financing: string[]
    stock: boolean
    recommended: boolean
    img: string | false
    brand: string
    group: string
    type: string
    description: string
    // For searching products
    search: string
}