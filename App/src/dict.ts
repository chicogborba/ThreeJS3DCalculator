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
    "group1294525603": "/",
    "group389477461": "-",
    "group23065195": "+="
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
    "/": ["group8797649", "group1752570532", "group1173938501"],
    "-": ["group1643812943"],
    "+=": ["group133655897", "group1271219890", "group466515903", "group836615341"]
};