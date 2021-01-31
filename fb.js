
//configura firebase
const firebaseConfig = {
    apiKey: "AIzaSyCeqJaKRR16qJIuHkImMPKh5Yyx0p9KErw",
    authDomain: "cadastro-63b61.firebaseapp.com",
    databaseURL: "https://cadastro-63b61.firebaseio.com",
    projectId: "cadastro-63b61",
    storageBucket: "cadastro-63b61.appspot.com",
    messagingSenderId: "136986714244",
    appId: "1:136986714244:web:4f29add78d5682143ca2d1"
};
//inicia firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();


pegar_dados();


function pegar_dados() {

    var nomes = [];
    var idades = [];
    var rgs = [];

    var star = firebase.database().ref();
    star.on('value', recebendo);

    function recebendo(dat) {

	    var datv = dat.val();
        if (datv != null) {
            //se tiver dados
            var nomes = [];
            var idades = [];
            var rgs = [];

            var data = Object.values(datv);

            for (var contador = 0; contador < data.length; contador++){
                nomes.push(data[contador]['nome']);
                idades.push(data[contador]['idade']);
                rgs.push(data[contador]['rg']);
            }
            //fazendo tabela com valores recebidos
            fazer_tabela_dados(nomes, idades, rgs);
        } else {
            //se nao tiver dados
            $('#tab').html('');
            fazer_tabela_inputs();
        }

    }


}


function fazer_tabela_dados(nomes, idades, rgs) {
    var tempo_atualizacao = 5000;
    //limpa tabela
    $('#tab').html('');
    //inicial tabela
    $('#tab').append('<table>');
    //linha
    fazer_tabela_inputs();
    for (var contador = 0; contador < nomes.length;contador++){
        $('#tab').append(
            //nome
            //'<tr><td class="tab_td"><input type="text" onblur="atualizar_dados("nome","'+rgs[contador]+'")" id="nome_'+rgs[contador]+'" value="' + nomes[contador].toUpperCase() + '"/></td>' +
            '<tr><td class="tab_td"><input type="text" id="nome' + rgs[contador] + '" value="' + nomes[contador] + '"/></td>' +
            '<script>$("#nome' + rgs[contador] + '").keydown(function (e) {if (e.key == "Enter") {console.log(e.key); atualizar_dados(1,' + rgs[contador] + ');}  if (e.key=="Delete"){console.log(e.key); deletar(' + rgs[contador] + ');} });</script>' +

            //idade
            '<td class="tab_td"><input type="number" id="idade' + rgs[contador] + '" value="' + idades[contador] + '" /></td>' +
            '<script>$("#idade' + rgs[contador] + '").keydown(function (e) {if (e.key == "Enter") {console.log(e.key); atualizar_dados(2,' + rgs[contador] + ');}  if (e.key=="Delete"){console.log(e.key); deletar(' + rgs[contador] + ');} });</script>' +
            //rg
            '<td class="tab_td"><input type="number" id="rg' + rgs[contador] + '" value="' + rgs[contador] + '" /></td>' +
            '<script>$("#rg' + rgs[contador] + '").keydown(function (e) {if (e.key == "Enter") {console.log(e.key); atualizar_dados(3,' + rgs[contador] + ');}  if (e.key=="Delete"){console.log(e.key); deletar(' + rgs[contador] + ');} });</script>' +
            '<td class="tab_td" onclick="deletar(' + rgs[contador] + ')" style="font-family:Segoe UI; color: rgb(95, 94, 94);">X</td></tr>');

    }

    //finaliza tabela
    $('#tab').append('</table>');
}
function fazer_tabela_inputs() {
    $('#tab').append('<tr><th class="tab_td">NOME</th><th class="tab_td">IDADE</th><th class="tab_td">RG</th></tr>' +
        //inputs para cadastro
        '<tr ><td class="tab_td"><input type="text" id="nome_cadastro" /></td>' +
        '<td class="tab_td"><input type="number" id="idade_cadastro" /></td>' +
        '<td class="tab_td"><input type="number" id="rg_cadastro" /></td>' +
        //quando clicar no enter no input rg, mandar para firebase
        //ou quando clicar no simbolo
        '<script>$("#rg_cadastro").keypress(function (e) {if (e.key == "Enter") {console.log(e.key); salvar();}});</script>' +
        '<td class="tab_td" onclick="salvar()" style="font-size: 19pt; color: rgb(95, 94, 94) ">🗸</td></tr>'
    );

}


function salvar() {
    if ($('#rg_cadastro').val() == '') {
        alert('RG vazio, por favor preencha');
    } else {

        registrar($('#nome_cadastro').val(), $('#idade_cadastro').val(), $('#rg_cadastro').val());
    }
}
function registrar(nome, idade, rg) {

    firebase.database().ref('user_' + rg).set({
        nome: nome,
        idade: idade,
        rg: rg,
        data_de_envio: (new Date().toLocaleDateString())
    })

}

function atualizar_dados(tipo_num, rg) {
    var tipo;
    //pegando tipo por extenso
    switch (tipo_num) {
        case 1:
            tipo = 'nome';
            break
        case 2:
            tipo = 'idade';
            break
        case 3:
            tipo = 'rg';
            break
    }

    var resposta = confirm('Deseja alterar ' + tipo + ' do usuário ' + rg + '? ');
    if (resposta) {
        //se usuario confirmar, atualizar firebase com dados do input
        var updates = {}
        var recebece_input = $('#' + tipo + rg).val();
        updates['user_' + rg + '/' + tipo] = recebece_input;
        var a = firebase.database().ref().update(updates);

        
        //caso queira alterar rg também será alterado o nome user
        if (tipo_num == 3) {
            var star = firebase.database().ref();
            //pega valores
            star.child('user_' + rg).once('value', function (snapshot) {    
                //transfere valores para o novo user
                firebase.database().ref('user_' + recebece_input).set(snapshot.val());
                //deleta antigo user
                firebase.database().ref().child('user_' + rg).remove();
            });

        } 

    } else {
        //se não, recarrega pagina com valores anteriores
        pegar_dados();
    }

}

function deletar(rg) {
    var resposta = confirm('Deseja deletar usuário ' + rg+'?');
    if (resposta) {
        firebase.database().ref().child("user_" + rg).remove();
    }
    
}



