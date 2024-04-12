// Dicionario para mapear os botões a partir do nomed do objeto
// dentro do modelo 3D
export const buttons_dictionary: { [key: string]: string }  = {
    "mesh2058303266": "7",
    "mesh502161026": "8",
    "mesh1297306164_1": "9",
    "mesh1587545857_1": "4",
    "mesh1020324790_1": "5",
    "mesh318797025_1": "6",
    "mesh1296408862_1": "1",
    "group1730796089": "2",
    "group293917853": "3",
    "mesh2033548222_1": "00",
    "group1280017540": "0",
    "group454468518": ".",
    "group1294525603": "÷",
    "group389477461": "-",
    "group23065195": "=",
    "group1294525603001": "x",
    "group389477461001": "+",
    "group389477461003": "C",
    "group389477461002": "CE",
}

export const inverted_buttons_dictionary: {[key: string]: string}  = {};

for (const key in buttons_dictionary) {
    const value = buttons_dictionary[key];
    inverted_buttons_dictionary[value] = key;
}


// Dicionario para mapear os numeros em cima dos botões
// dentro do modelo 3D
export const buttons_numbers: { [key: string]: Array<string> } = {
    "7": ["mesh2058303266_1"],
    "8": ["mesh502161026_1"],
    "9": ["mesh1297306164"],
    "4": ["mesh1587545857"],
    "5": ["mesh1020324790"],
    "6": ["mesh318797025"],
    "1": ["mesh1296408862"],
    "2": ["group51909272", "group2060062126", "group450101333", "group991849902", "group1455072456"],
    "3": ["group1621648348", "group1303773984", "group1370157279", "group1454253446"],
    "00": ["mesh2033548222"],
    "0": ["group1011208216", "group1814558664", "group1638635107", "group901693912"],
    ".": ["group1105652737"],
    "÷": ["group8797649", "group1752570532", "group1173938501"],
    "-": ["group1643812943"],
    "=": ["group466515903", "group836615341"],
    "x": ["group1271219890001", "group1271219890002"],
    "+": ["group1271219890003", "group133655897001"],
    "C": ["group1011208216003", "group901693912007", "group901693912006"],
    "CE": ["group1011208216001", "group901693912001", "group901693912002", "group1011208216002", "group901693912003", "group901693912005", "group901693912004"],
};

export const inverted_buttons_numbers: {[key: string]: string}  = {};

for (const key in buttons_numbers) {
    const values = buttons_numbers[key];
    values.forEach(value => {
        inverted_buttons_numbers[value] = key;
    });
}


// other components of the calculator with animations and functionalities
// different from the numbers and operators
export const other_objs: { [key: string]: string } = {
    "mesh1536966674_1" :"on/off",
    "group1695896375": "slider"
}

export const LEDs : { [key: string]: string } = {
   led1:  "group349876400",
    led2:"group1099422973",
    led3:"group1737963207" ,
}

export const LEDsCodes : { [key: string]: string } = {
  group349876400:  "led1",
    group1099422973: "led2",
    group1737963207: "led3" ,
}

export const paperName = "group1065846868"
export const paperRollName = "group1325531539"


export let paperTextPositions:any = {
    0: {
        x: -0.2,
        y: 0.7,
        z: -4.2,
        rotation: 0,
        othersZValue: {}
    },
    1: {
        x: -0.2,
        y: 1.4,
        z: -4.3,
        rotation: 0,
        othersZValue: {}
    },
    2: {
        x: -0.2,
        y: 2.1,
        z: -4.5,
        rotation: -0.1,
        othersZValue: {
            first: -4.5
        }
    },
    3: {
        x: -0.2,
        y: 2.8,
        z: -4.8,
        rotation: -0.2,
        othersZValue: {
            first: -4.6,
            second: -4.7
        }
    }
}
