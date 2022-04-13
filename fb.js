﻿
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

    var star = firebase.database().ref();
    star.on('value', recebendo);

    function recebendo(dat) {

        var datv = dat.val();
        if (datv) {

            var infos = Object.values(datv);

            //fazendo tabela com valores recebidos
            fazer_tabela_dados(infos);

        } else {
            //se nao tiver dados
            $('#tab').html('');
            fazer_tabela_inputs();
        }

    }


}


function fazer_tabela_dados(infos) {
    //limpa tabela
    $('#tab').html('');
    //inicial tabela
    $('#tab').append('<table>');
    //linha
    fazer_tabela_inputs();
    for (cont in infos) {
        let info = infos[cont];
        let rg = info.rg
        let nome = info.nome
        let idade = info.idade

        $('#tab').append(

            //nome
            `<tr><td class="tab_td"><input type="text" id="nome_${rg}" value="${nome}"/></td>` +

            //idade
            `<td class="tab_td"><input type="number" id="idade_${rg}" value="${idade}" /></td>` +

            //rg
            `<td class="tab_td"><input type="number" id="rg_${rg}" value="${rg}" /></td>` +

            //botão de excluir
            `<td class="tab_td btn_delete" onclick="deletar(${rg})">X</td></tr>` );

        const handle_key = (tipo, e) => {
            if (e.key == "Enter")
                atualizar_dados(tipo, rg);
            if (e.key == "Delete")
                deletar(rg);
        }

        $("#rg_" + rg).keydown((e) => handle_key("rg", e));
        $("#nome_" + rg).keydown((e) => handle_key("nome", e));
        $("#idade_" + rg).keydown((e) => handle_key("idade", e));

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
        '<td class="tab_td btn_save" onclick="salvar()">🗸</td></tr>'
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

function atualizar_dados(tipo, rg) {

    var resposta = confirm(`Deseja alterar ${tipo} do usuário ${rg}? `);
    if (resposta) {
        //se usuario confirmar, atualizar firebase com dados do input
        var updates = {}
        var recebece_input = $(`#${tipo}_${rg}`).val();
        updates['user_' + rg + '/' + tipo] = recebece_input;
        var a = firebase.database().ref().update(updates);


        //caso queira alterar rg também será alterado o nome user
        if (tipo == "rg") {
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
    var resposta = confirm('Deseja deletar usuário ' + rg + '?');
    if (resposta) {
        firebase.database().ref().child("user_" + rg).remove();
    }

}



