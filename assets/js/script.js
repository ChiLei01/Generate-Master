/**
 * Created by Kiki on 16/03/2018.
 */

let saveMonsters = [];
let monsters;
let monster;

let showCR = function () {
    let CR = [];

    monsters.map((x) => CR.push(x.challenge_rating));

    CR = CR.filter((v, i, a) => a.indexOf(v) === i);
    CR.sort((a, b) => a - b);

    CR.map((x) => $("#cr").append("<option value='" + x + "'>" + x + "</option>"));
};

let showSize = function () {
    let sizes = ["Tiny", "Small", "Medium", "Large", "Huge", "Gargantuan"];

    sizes.map((x) => $("#size").append("<option value='" + x + "'>" + x + "</option>"));
};

let showTypes = function () {
    let types = [];

    monsters.map((x) => types.push(x.type));

    types = unique(types);
    types.sort();

    types.map((x) => $("#type").append("<option value='" + x + "'>" + x + "</option>"));
};

let showLanguage = function () {
    let languages = [];

    for(let i = 0; i<monsters.length; i++){
        if(monsters[i].languages !== ""){
            let monsterLanguages = monsters[i].languages.split(",");
            monsterLanguages = monsterLanguages.map(x => x.trim().substr(0,1).toUpperCase() + x.trim().substr(1));
            monsterLanguages.map((x) => (x.match("^And"))?(languages.push(x.substr(4))):(languages.push(x)));
        } else {
            languages.push("No language");
        }
    }

    languages = unique(languages);
    languages.sort();

    languages.map((x) => $("#language").append("<option value='" + x + "'>" + x + "</option>"));

};

let showAlignment = function () {
    let alignments = [];

    monsters.map((x) => alignments.push(x.alignment));

    alignments = unique(alignments);
    alignments.sort();

    alignments.map((x) => $("#alignment").append("<option value='" + x + "'>" + x + "</option>"));
};

let unique = function (array) {
    return array.filter(function(el, index, arr) {
        return index === arr.indexOf(el);
    });
};

let generate = function () {
    let cr = $("#cr").val();
    let size = $("#size").val();
    let type = $("#type").val();
    let language = $("#language").val().toLowerCase();
    let alignment = $("#alignment").val();
    let random;
    let filterMonsters;

    if(language === 'No language')
        language = "";

    if(cr !== 'any')
        cr = parseInt(cr);

    if(cr !== 'any')
        filterMonsters = monsters.filter(x => x.challenge_rating === cr);

    if(size !== 'any')
        filterMonsters = monsters.filter(x => x.size === size);

    if(type !== 'any')
        filterMonsters = monsters.filter(x => x.type === type);

    if(language !== 'any')
        filterMonsters = monsters.filter(x => x.languages.toLowerCase().indexOf(language) >= 0);

    if(alignment !== 'any')
        filterMonsters = monsters.filter(x => x.alignment === alignment);

    if(filterMonsters === undefined){
        filterMonsters = monsters;
    }

    if(filterMonsters.length !== 0){
        random = Math.floor(Math.random() * (filterMonsters.length));

        monster = filterMonsters[random];

        showMonster(true);
    }else{
        $("article").empty().append("<img src='assets/images/noMonsters.png'>").addClass( "image" );
    }
};

let showMonster = function (isGenerate) {
    let random = 0;
    let savingThrows = checkAvailableSafe(monster);
    let skills = checkAvailableSkills(monster);
    let specialAbilities = getSpecialAbilities(monster);
    let actions = getActions(monster);
    let legendaryActions = getLegendaryActions(monster);
    let languages = (monster.languages === "")?("---"):(monster.languages);
    let conditionImmunities = (monster.condition_immunities !== "")?("<p><strong>Condition Immunities</strong> " + monster.condition_immunities + "</p>"):("");
    let damageImmunities = (monster.damage_immunities !== "")?("<p><strong>Damage Immunities</strong> " + monster.damage_immunities + "</p>"):("");
    let damageResistances = (monster.damage_resistances !== "")?("<p><strong>Damage Resistances</strong> " + monster.damage_resistances + "</p>"):("");
    let damageVulnerabilities = (monster.damage_vulnerabilities !== "")?("<p><strong>Damage Vulnerabilities</strong> " + monster.damage_vulnerabilities + "</p>"):("");
    let subtype = (monster.subtype !== "")?(" (" + monster.subtype + ")"):("");
    let button = checkInSave();

    if(isGenerate){
        random = Math.floor(Math.random() * (11)) -5;
    }

    monster.hit_points = monster.hit_points + random;

    $('article').empty().removeClass().append(
        button +
        "<h2>" + monster.name + "</h2>" +
        "<p>" + monster.size +" " + monster.type + subtype + ", " + monster.alignment + "</p>" +
        "<div>" +
            "<p><strong>Armor Class</strong> " + monster.armor_class + "</p>" +
            "<p><strong>Hit Points</strong> " + (monster.hit_points ) + "</p>" +
            "<p><strong>Speed</strong> " + monster.speed + "</p>" +
        "</div>"+
        "<table>" +
            "<tr>"+
                "<th>STR</th>" +
                "<th>DEX</th>" +
                "<th>CON</th>" +
                "<th>INT</th>" +
                "<th>WIS</th>" +
                "<th>CHA</th>" +
            "</tr>"+
            "<tr>" +
                "<td>" + monster.strength + "</td>"+
                "<td>" + monster.dexterity + "</td>"+
                "<td>" + monster.constitution + "</td>"+
                "<td>" + monster.intelligence + "</td>"+
                "<td>" + monster.wisdom + "</td>"+
                "<td>" + monster.charisma + "</td>"+
            "</tr>" +
        "</table>" +
        "<div>" +
            "<p><strong>Saving Throws</strong> " + savingThrows + "</p>" +
            "<p><strong>Skills</strong> " + skills + "</p>" +
            damageVulnerabilities +
            damageResistances +
            damageImmunities +
            conditionImmunities +
            "<p><strong>Senses</strong> " + monster.senses + "</p>" +
            "<p><strong>Languages</strong> " + languages + "</p>" +
            "<p><strong>Challenge</strong> " + monster.challenge_rating + "</p>" +
        "</div>"+
        "<div class='specialAbilities'>" +
            specialAbilities +
        "</div>" +
        "<div class='actions'>" +
            actions +
        "</div>"+
        "<div class='legendaryActions'>" +
            legendaryActions+
        "</div>"
    );
};

let checkInSave = function (){
    if (saveMonsters !== 0 && saveMonsters.filter(x => x.name === monster.name).length > 0) {
        return "<button class='btn save'>Set monster free</button>"
    }
    return "<button class='btn save'>Capture monster</button>"
};

let getLegendaryActions = function (){
    let legendaryActions = "";
    $.each( monster.legendary_actions, function( index, lAction ){
        legendaryActions += "<p><strong>" + lAction.name + ".</strong> " +  lAction.desc + "</p>"
    });

    if(legendaryActions === ""){
        return ""
    }

    legendaryActions = "<h3>Legendary Actions</h3>" + legendaryActions;

    return legendaryActions
};

let getSpecialAbilities = function (){
    let specialAbilities = "";
    $.each( monster.special_abilities, function( index, ability ){
        specialAbilities += "<p><strong>" + ability.name + ".</strong> " +  ability.desc + "</p>"
    });

    return specialAbilities
};

let getActions = function (){
    let actions = "";
    $.each( monster.actions, function( index, action ){
        actions += "<p><strong>" + action.name + ".</strong> " +  action.desc + "</p>"
    });

    if(actions === ""){
        return ""
    }

    actions = "<h3>Actions</h3>" + actions;

    return actions
};

let checkAvailableSkills = function (){
    let skills = '';

    if(monster.athletics !== undefined){
        skills = "Athletics +" + monster.athletics + ", ";
    }
    if(monster.acrobatics !== undefined){
        skills += "Acrobatics +" + monster.acrobatics + ", ";
    }
    if(monster.stealth !== undefined){
        skills += "Stealth +" + monster.stealth + ", ";
    }
    if(monster.arcana !== undefined){
        skills += "Arcana +" + monster.arcana + ", ";
    }
    if(monster.history !== undefined){
        skills += "History +" + monster.history + ", ";
    }
    if(monster.investigation !== undefined){
        skills += "Investigation +" + monster.investigation + ", ";
    }
    if(monster.nature !== undefined){
        skills += "Nature +" + monster.nature + ", ";
    }
    if(monster.religion !== undefined){
        skills += "Religion +" + monster.religion + ", ";
    }
    if(monster.insight !== undefined){
        skills += "Insight +" + monster.insight + ", ";
    }
    if(monster.medicine !== undefined){
        skills += "Medicine +" + monster.medicine + ", ";
    }
    if(monster.perception !== undefined){
        skills += "Perception +" + monster.perception + ", ";
    }
    if(monster.survival !== undefined){
        skills += "Survival +" + monster.survival + ", ";
    }
    if(monster.deception !== undefined){
        skills += "Deception +" + monster.deception + ", ";
    }
    if(monster.intimidation !== undefined){
        skills += "Intimidation +" + monster.intimidation + ", ";
    }
    if(monster.performance !== undefined){
        skills += "Performance +" + monster.performance + ", ";
    }
    if(monster.persuasion !== undefined){
        skills += "Persuasion +" + monster.persuasion + ", ";
    }

    if(skills === ""){
        return "---"
    }

    return skills.substr(0,skills.length - 2);
};

let checkAvailableSafe = function(){
    let savingThrows = '';

    if(monster.strength_save !== undefined && monster.strength_save !== 0){
        savingThrows = "Str +" + monster.strength_save + ", ";
    }
    if(monster.dexterity_save !== undefined && monster.dexterity_save !== 0){
        savingThrows += "Dex +" + monster.dexterity_save + ", ";
    }
    if(monster.constitution_save !== undefined && monster.constitution_save !== 0){
        savingThrows += "Con +" + monster.constitution_save + ", ";
    }
    if(monster.intelligence_save !== undefined && monster.intelligence_save !== 0){
        savingThrows += "Int +" + monster.intelligence_save + ", ";
    }
    if(monster.wisdom_save !== undefined && monster.wisdom_save !== 0){
        savingThrows += "Wis +" + monster.wisdom_save + ", ";
    }
    if(monster.charisma_save !== undefined && monster.charisma_save !== 0){
        savingThrows += "Cha +" + monster.charisma_save + ", ";
    }

    if(savingThrows === ""){
        return "---"
    }

    return savingThrows.substr(0,savingThrows.length - 2);
};

let modifySaveList = function () {
    let alert;

    if($(this).text() === "Capture monster"){
        saveMonsters.push(monster);
        alert = '<div class="alert alert-success"><strong>Saved!</strong> You have successfully captured the monster.</div>'
    }else{
        saveMonsters = $.grep(saveMonsters, function(value) {
            return value.name !== monster.name;
        });
        alert = '<div class="alert alert-warning"><strong>Deleted!</strong> You have set the monster free.</div>'
    }

    localforage.setItem('monster', saveMonsters);
    showMonster(false);
    $("article").prepend(alert);
};

let showListSaveMonsters = function () {
    $("article").empty().removeClass().addClass('center').append("<h2>My Monsters</h2><ul></ul>");

    if (saveMonsters.length === 0) {
        $("article").append("<p>You have no captured monsters.</p>");
    }else{
        saveMonsters.sort(SortByName).map(x => $("ul").append("<li><a href='#'>" + x.name + "</a></li>"));
        $("article").append("<button class='btn removeMonster'>Set all monsters free</button>");
    }
};

let SortByName = function (a, b){
    let aName = a.name.toLowerCase();
    let bName = b.name.toLowerCase();
    return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
};

let showSaveMonster = function () {
    monster = monsters.filter(x => x.name === $(this).text())[0];
    showMonster(false);
};

let removeAllMonsters = function () {
    localforage.clear();
    saveMonsters = [];
    showListSaveMonsters();
};

$(document).ready(function () {
    showSize();

    localforage.getItem("monster").then(function (value) {
        if(value !== null){
            saveMonsters = value;
        }
    });

    $.getJSON( "assets/data/5e-SRD-Monsters.json", function( list ) {
        monsters = list;
        showTypes();
        showCR();
        showLanguage();
        showAlignment();
        $(".btn-lg").on('click', generate);
        $("button + button").on('click', showListSaveMonsters);
        $("article").on("click",".save", modifySaveList);
        $("article").on("click","li a", showSaveMonster);
        $("article").on("click",".removeMonster", removeAllMonsters);
    });
});