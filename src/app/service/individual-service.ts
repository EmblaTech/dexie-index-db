import { Injectable } from "@angular/core";
import Dexie from "dexie";
import { IndexDBService } from "./db-service";
import { Individual } from "../model/domain/individual";
import { Family } from "../model/domain/family";
import { MultiMedia } from "../model/domain/multimedia";

@Injectable({
    providedIn: 'root'
  })
export class IndividualService {
    individualTbl : Dexie.Table;
    familyTbl: Dexie.Table;
    eventTbl: Dexie.Table;
    multiMediaTbl: Dexie.Table;
    placeTbl: Dexie.Table;

    INDIVIDUAL_COUNT = 100;
    SAMPLE_DATA_COUNT = 100;
    BATCH_SIZE = 1000

    constructor(private dbService: IndexDBService) { 
        this.individualTbl = this.dbService.getIndividualStore();
        this.familyTbl = this.dbService.getFamilyStore();
        this.eventTbl = this.dbService.getEventStore();
        this.multiMediaTbl = this.dbService.getMultiMediaStore();
        this.placeTbl = this.dbService.getPlaceStore();

        //this.individualTbl.hook('creating', this.captureChangeData('created'))
        this.individualTbl.hook('updating', this.captureUpdatedData())
        this.individualTbl.hook('deleting', this.captureDeletedData())
    }

    async addBulk(): Promise<void> {
        const bulkIndividuals: Individual[] = [];
        for (let i = 1; i <= this.INDIVIDUAL_COUNT; i++) {
          let individual = this.build(i)
          bulkIndividuals.push(individual);      
        }    
        await this.batchInsert(bulkIndividuals);
    }

    //Since transaction fails for large bulk inserts. Insert as batches
    private async batchInsert(bulkIndividuals: Individual[]) {
        for (let i = 0; i < bulkIndividuals.length; i += this.BATCH_SIZE) {
        const batchIndividuals = bulkIndividuals.slice(i, i + this.BATCH_SIZE);
        await this.individualTbl.bulkAdd(batchIndividuals)
        }
    }

    private build(i: number) {
        let fName = this.firstNames[Math.floor(Math.random() * this.SAMPLE_DATA_COUNT)];
        let lName = this.lastNames[Math.floor(Math.random() * this.SAMPLE_DATA_COUNT)];
        let domain = this.domains[Math.floor(Math.random() * this.SAMPLE_DATA_COUNT)];
        fName = fName != undefined ? fName : "first-" + i.toString();
        lName = lName != undefined ? lName : "last-" + i.toString();
        domain = domain != undefined ? domain : "domain" + i.toString() + ".no";
        const individual: Individual = {
        id: i,
        firstName: fName,
        lastName: lName,
        address: this.addresses[Math.floor(Math.random() * this.SAMPLE_DATA_COUNT)],
        birthPlace: this.birthplaces[Math.floor(Math.random() * this.SAMPLE_DATA_COUNT)],
        displayName: fName + ' ' + lName,
        email: fName.toLowerCase() + "@" + domain,
        gender: i % 2 === 0 ? 'M' : 'F',
        isAlive: Math.random() > 0.5,
        middleName: this.middleNames[Math.floor(Math.random() * this.SAMPLE_DATA_COUNT)],
        phone: `123-456-${i.toString().padStart(4, '0')}`
        };
        return individual;
    }

    async getAll() : Promise<Individual[]> {
        return this.individualTbl.toArray()
    }

    async update(individual?: Individual): Promise<void> {     
        await this.individualTbl.put(individual, individual?.id);
    }

    async delete(id: number): Promise<void> {     
        await this.individualTbl.delete(id);
    }

    async searchByName(key: string): Promise<Individual[]> {     
        return await this.individualTbl.where('firstName').startsWithIgnoreCase(key)
        .toArray();
    }

    async searchById(id: number): Promise<Individual[]> {     
        return [await this.individualTbl.get(id)];
    }

    async count(): Promise<number> {     
        return await this.individualTbl.count()
    }

    private captureUpdatedData(){
        return async (mods: any, primaryKey: any, obj: any, transaction: any) => {
            const updatedObject = { ...obj, ...mods };
            alert("Captured updated object data: " + JSON.stringify(updatedObject) + "\n\n\nOriginal object data:" + JSON.stringify(obj))
          };
    }

    private captureDeletedData() {
        return async (primaryKey: any, obj: any, transaction: any) => {
            //console.log("Captured " + operation + " data: " + JSON.stringify(obj) )
            alert("Captured deleted data: " + JSON.stringify(obj))
          };
    }

    async getEvents(individualId: number): Promise<Event[]> {
        const individual = await this.individualTbl.get(individualId);
        if (individual?.eventIds) {
          return await this.eventTbl.bulkGet(individual.eventIds);
        }
        return [];
    }

    async getFamilies(individualId: number): Promise<Family[]> {
        const individual = await this.individualTbl.get(individualId);
        if (individual?.familyIds) {
          return await this.familyTbl.bulkGet(individual.familyIds);
        };
        return []
    }

    async getCurrentFamily(individualId: number): Promise<Family | undefined> {
        const families = await this.getFamilies(individualId);
        return families.find(f => f.isDefault === true);
    }

    async getMultiMedias(individualId: number): Promise<MultiMedia[]> {
        const individual = await this.individualTbl.get(individualId);
        if (individual?.multiMediaIds) {
          return await this.multiMediaTbl.bulkGet(individual.multiMediaIds);
        };
        return []
    }

    async getProfileImage(individualId: number): Promise<MultiMedia | undefined> {
        const images = await this.getMultiMedias(individualId);
        return images.find(m => m.isDefault === true); // Filter out only default image
    }

    firstNames = [
        "Anders", "Bjørn", "Christian", "Dag", "Einar", "Finn", "Geir", "Harald",
        "Ivar", "Jan", "Kjell", "Lars", "Magnus", "Nils", "Olav", "Per", "Rune",
        "Steinar", "Thor", "Ulf", "Vidar", "Arne", "Berit", "Cathrine", "Dagny",
        "Elin", "Frida", "Grete", "Hanne", "Ingrid", "Jorunn", "Kari", "Lene",
        "Maren", "Nina", "Oda", "Pernille", "Randi", "Siri", "Tone", "Unni", "Vilde",
        "Åse", "Anne", "Bente", "Camilla", "Dorthe", "Eva", "Gunn", "Hilde", "Ida",
        "Janne", "Karin", "Lisbeth", "Mette", "Nora", "Oline", "Petra", "Ragnhild",
        "Sofie", "Tove", "Ulla", "Vibeke", "Aksel", "Bjørnar", "Carl", "David",
        "Eirik", "Fredrik", "Gunnar", "Håkon", "Isak", "Jakob", "Kristian", "Leif",
        "Morten", "Niklas", "Odd", "Pål", "Rolf", "Sigurd", "Tor", "Vegar", "Willy",
        "Asbjørn", "Birger", "Cato", "Dagfinn", "Erik", "Frans", "Gisle", "Halvor",
        "Inge", "Jens", "Knut", "Ludvig"
    ];

    middleNames = [
        "Alexander", "Benedikte", "Cornelius", "Dagfinn", "Eirik", "Fredrik", "Gustav",
        "Helene", "Ingeborg", "Johanne", "Kristine", "Ludvig", "Magnhild", "Nicolai",
        "Ottar", "Pernille", "Quintus", "Ragnhild", "Sigurd", "Thorbjørn", "Ulf",
        "Viktor", "William", "Xenia", "Yngve", "Zara", "Agnes", "Birgitte", "Charlotte",
        "David", "Emil", "Frida", "Grete", "Hans", "Inge", "Johan", "Kari", "Lars",
        "Morten", "Nina", "Olav", "Per", "Randi", "Sigrid", "Tor", "Unni", "Vidar",
        "Wenche", "Yngvild", "Øyvind", "Åse", "Anette", "Bjarne", "Carl", "Dag",
        "Elisabeth", "Frode", "Gunnar", "Heidi", "Iselin", "Jan", "Karine", "Lene",
        "Mona", "Nora", "Odd", "Pål", "Rune", "Siv", "Terje", "Ulla", "Vigdis",
        "Willy", "Åge", "Andreas", "Brita", "Cecilie", "Dennis", "Elin", "Finn",
        "Gerd", "Håvard", "Ingrid", "Jonas", "Kjetil", "Leif", "Martin", "Nils",
        "Oda", "Petter", "Rolf", "Synne", "Torbjørn", "Ulf", "Vibeke"
    ];

    lastNames = [
        "Hansen", "Johansen", "Olsen", "Larsen", "Andersen", "Pedersen", "Nilsen",
        "Kristiansen", "Jensen", "Karlsen", "Johnsen", "Pettersen", "Eriksen",
        "Berg", "Haugen", "Hagen", "Andreassen", "Jacobsen", "Dahl", "Jørgensen",
        "Henriksen", "Svendsen", "Moen", "Iversen", "Solberg", "Martinsen",
        "Rasmussen", "Gundersen", "Moe", "Nygård", "Thomsen", "Paulsen", "Bakke",
        "Antonsen", "Strand", "Ellingsen", "Bakken", "Lien", "Haug", "Sæther",
        "Sørensen", "Arnesen", "Gulbrandsen", "Tangen", "Løkken", "Helle", "Tveit",
        "Østby", "Brekke", "Aune", "Foss", "Aas", "Mikkelsen", "Torset", "Sandvik",
        "Sund", "Ness", "Vik", "Rønning", "Eggen", "Borge", "Reitan", "Sletvold",
        "Moe", "Solli", "Kolstad", "Lind", "Hustad", "Fjell", "Solem", "Bjørnstad",
        "Strøm", "Holt", "Bjerke", "Sundby", "Sørum", "Skogen", "Sunde", "Haaland",
        "Rosenlund", "Røst", "Rye", "Vikan", "Kleven", "Lund", "Nilsen", "Skaanes",
        "Aarseth", "Torp", "Lien", "Bjerke", "Dyrhaug", "Løvås", "Sveen", "Valen",
        "Skar", "Fagerland", "Torvik", "Eik"
    ];

    addresses = [
        "Karl Johans gate 1, 0154 Oslo", "Dronning Eufemias gate 4, 0191 Oslo",
        "Storgata 8, 0184 Oslo", "Henrik Ibsens gate 60A, 0255 Oslo",
        "Grensen 17, 0159 Oslo", "Rådhusgata 24, 0151 Oslo", "Universitetsgata 14, 0164 Oslo",
        "Nedre Slottsgate 7, 0157 Oslo", "Kirkegata 10, 0153 Oslo", "Akersgata 55, 0180 Oslo",
        "Parkveien 78, 0254 Oslo", "Hegdehaugsveien 34, 0352 Oslo", "Torggata 35, 0183 Oslo",
        "Skippergata 19, 0152 Oslo", "Kongens gate 31, 0153 Oslo", "Tollbugata 8, 0152 Oslo",
        "Øvre Slottsgate 11, 0157 Oslo", "Kristian IVs gate 12, 0164 Oslo",
        "Prinsens gate 6, 0152 Oslo", "Stenersgata 1, 0184 Oslo", "Youngs gate 11, 0181 Oslo",
        "Grubbegata 4, 0179 Oslo", "Hausmanns gate 28, 0182 Oslo", "Maridalsveien 21, 0178 Oslo",
        "Wergelandsveien 1, 0167 Oslo", "Pilestredet 35, 0166 Oslo", "C. J. Hambros plass 2, 0164 Oslo",
        "Calmeyers gate 15, 0183 Oslo", "Fredensborgveien 22, 0177 Oslo", "Biskop Gunnerus' gate 14A, 0185 Oslo",
        "Møllergata 38, 0179 Oslo", "Tøyengata 2, 0190 Oslo", "Brugata 3, 0186 Oslo",
        "Lakkegata 55, 0187 Oslo", "Trondheimsveien 1, 0560 Oslo", "Sannergata 32, 0557 Oslo",
        "Lørenveien 45, 0585 Oslo", "Hasleveien 28, 0571 Oslo", "Grefsenveien 17, 0482 Oslo",
        "Munkedamsveien 45, 0250 Oslo", "Akersgata 73, 0180 Oslo", "St. Olavs gate 24, 0166 Oslo",
        "Hammersborggata 9, 0179 Oslo", "Kirkeveien 64A, 0364 Oslo", "Majorstuveien 37, 0367 Oslo",
        "Schweigaards gate 34A, 0191 Oslo", "Langgata 25, 0566 Oslo", "Kjølberggata 27, 0653 Oslo",
        "Vogts gate 28, 0474 Oslo", "Hegdehaugsveien 36, 0352 Oslo", "Thereses gate 30, 0354 Oslo",
        "Ullevålsveien 12, 0171 Oslo", "Borggata 2B, 0650 Oslo", "Stockfleths gate 4, 0461 Oslo",
        "Maridalsveien 78, 0461 Oslo", "Sofies gate 72, 0454 Oslo", "Waldemar Thranes gate 84, 0175 Oslo",
        "Pilestredet 75C, 0354 Oslo", "Geitmyrsveien 69, 0455 Oslo", "Bjerregaards gate 29, 0172 Oslo",
        "Hoff Terrasse 1, 0275 Oslo", "Olav Kyrres gate 15, 0273 Oslo", "Middelthuns gate 27, 0368 Oslo",
        "Bogstadveien 54, 0366 Oslo", "Kirkeveien 114B, 0361 Oslo", "Michelets vei 33, 1366 Lysaker",
        "Lilleakerveien 16, 0283 Oslo", "Stovnerveien 20, 0980 Oslo", "Haavard Martinsens vei 25, 0978 Oslo",
        "Stovner Senter 3, 0985 Oslo", "Nedre Rommen 5, 0988 Oslo", "Tokerudberget 25, 0989 Oslo",
        "Romsås Senter 1, 0970 Oslo", "Maria Dehlis vei 40, 1083 Oslo", "Kalbakkveien 29, 0953 Oslo",
        "Trondheimsveien 400, 0953 Oslo", "Lutvannveien 53, 0676 Oslo", "Ulvenveien 92, 0581 Oslo",
        "Tvetenveien 152, 0671 Oslo", "Høybråtenveien 88, 1086 Oslo", "Økern Torgvei 21, 0580 Oslo",
        "Lofsrudveien 6, 1281 Oslo", "Prinsdal Senter 6, 1263 Oslo", "Holmlia Senter vei 17, 1255 Oslo",
        "Mortensrudveien 8, 1283 Oslo", "Smedbergveien 5, 1414 Trollåsen", "Oppegårdveien 59, 1415 Oppegård",
        "Siggerudveien 10, 1416 Oppegård", "Tømteveien 10, 1430 Ås", "Rådhusveien 1, 1430 Ås",
        "Drøbakveien 15, 1433 Ås", "Vestbyveien 18, 1540 Vestby", "Vestbyveien 23, 1540 Vestby",
        "Vestbyveien 28, 1540 Vestby", "Mossefossen 1, 1531 Moss", "Gudes gate 3, 1530 Moss"
    ];

    birthplaces = [
        "Oslo", "Bergen", "Trondheim", "Stavanger", "Drammen", "Fredrikstad", "Kristiansand",
        "Tromsø", "Sandnes", "Sarpsborg", "Skien", "Ålesund", "Tønsberg", "Moss", "Haugesund",
        "Arendal", "Bodø", "Porsgrunn", "Hamar", "Larvik", "Halden", "Harstad", "Molde", "Kongsberg",
        "Gjøvik", "Mo i Rana", "Narvik", "Lillehammer", "Steinkjer", "Elverum", "Sandefjord",
        "Horten", "Førde", "Åkrehamn", "Florø", "Grimstad", "Mandal", "Flekkefjord", "Namsos",
        "Kongsvinger", "Levanger", "Notodden", "Stord", "Voss", "Fauske", "Brumunddal", "Jessheim",
        "Stjørdal", "Røros", "Nesoddtangen", "Askøy", "Alta", "Sogndal", "Strømmen", "Farsund",
        "Holmestrand", "Brekstad", "Tvedestrand", "Nærbø", "Ulsteinvik", "Bryne", "Råde", "Jørpeland",
        "Røyken", "Støren", "Lyngdal", "Brønnøysund", "Verdal", "Svolvær", "Vadsø", "Leknes",
        "Lillestrøm", "Årdalstangen", "Namsos", "Førde", "Raufoss", "Ørsta", "Rjukan", "Tynset",
        "Vinstra", "Lom", "Sistranda", "Svelvik", "Kragerø", "Førde", "Ørnes", "Os", "Flekkefjord",
        "Skudeneshavn", "Vennesla", "Evje", "Sauda", "Tana", "Skarnes", "Gol", "Hemnesberget",
        "Fosnavåg", "Løten", "Vinstra", "Skibotn", "Dombås"
    ];

    domains = [
        "example.no", "mail.no", "norge.no", "oslo.no", "bergen.no", "trondheim.no",
        "stavanger.no", "drammen.no", "fredrikstad.no", "kristiansand.no", "tromso.no",
        "sandnes.no", "sarpsborg.no", "skien.no", "alesund.no", "tonsberg.no", "moss.no",
        "haugesund.no", "arendal.no", "bodo.no", "porsgrunn.no", "hamar.no", "larvik.no",
        "halden.no", "harstad.no", "molde.no", "kongsberg.no", "gjovik.no", "moirana.no",
        "narvik.no", "lillehammer.no", "steinkjer.no", "elverum.no", "sandefjord.no",
        "horten.no", "forde.no", "akrehamn.no", "floro.no", "grimstad.no", "mandal.no",
        "flekkefjord.no", "namsos.no", "kongsvinger.no", "levanger.no", "notodden.no",
        "stord.no", "voss.no", "fauske.no", "brumunddal.no", "jessheim.no", "stjordal.no",
        "roros.no", "nesoddtangen.no", "askoy.no", "alta.no", "sogndal.no", "strommen.no",
        "farsund.no", "holmestrand.no", "brekstad.no", "tvedestrand.no", "naerbo.no",
        "ulsteinvik.no", "bryne.no", "rade.no", "jorpeland.no", "royken.no", "storen.no",
        "lyngdal.no", "bronnoysund.no", "verdal.no", "svolvaer.no", "vadso.no", "leknes.no",
        "lillestrom.no", "ardalstangen.no", "namsos.no", "raufoss.no", "orsta.no", "rjukan.no",
        "tynset.no", "vinstra.no", "lom.no", "sistranda.no", "svelvik.no", "kragero.no",
        "ornes.no", "os.no", "flekkefjord.no", "skudeneshavn.no", "vennesla.no", "evje.no",
        "sauda.no", "tana.no", "skarnes.no", "gol.no", "hemnesberget.no", "fosnavag.no",
        "loten.no", "vinstra.no", "skibotn.no", "dombas.no"
    ];
}