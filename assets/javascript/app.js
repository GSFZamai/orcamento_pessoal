class Despesa {
    constructor(ano, mes, dia, tipo, descricao, valor) {
        this.ano = ano;
        this.mes = mes;
        this.dia = dia;
        this.tipo = tipo;
        this.descricao = descricao;
        this.valor = valor;
    }

    validaDados() {
        for (let i in this) {
            if (this[i] == undefined || this[i] == '' || this[i] == null) {
                return false;
            }
        }
        return true;
    }
}

class Bd {
    constructor(){
        let id = localStorage.getItem('id');

        if (id === null) {
            localStorage.setItem('id', 0);
        }
    }

    getProximoId () {
        let proximoId = localStorage.getItem('id');
        return parseInt(proximoId) + 1;
    }

    gravar(d) {
        let id = this.getProximoId();

        localStorage.setItem(id, JSON.stringify(d))

        localStorage.setItem('id', id)
    }

    listarDespesas() {
        let despesas = [];

        let id = localStorage.getItem('id');

        for (let i = 1; i <= id; i++) {
            let despesa = JSON.parse(localStorage.getItem(i));

            if (despesa == null) {
                continue;
            }

            despesa.id = i;
            despesas.push(despesa);
        }

        return despesas;
    }

    pesquisar(despesa) {
        let despesas = despesa;
        let despesasFiltradas = this.listarDespesas();

        if (despesas.ano != "") {
            despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesas.ano);
        }

        if (despesas.mes != "") {
            despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesas.mes);
        }

        if (despesas.dia != "") {
            despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesas.dia);
        }

        if (despesas.tipo != "") {
            despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesas.tipo);
        }

        if (despesas.descricao != "") {
            despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesas.descricao);
        }

        if (despesas.valor != "") {
            despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesas.valor);
        }

        return despesasFiltradas;
    }

    remover(id) {
        localStorage.removeItem(id);
    }
}

let bd = new Bd();

function cadastrarDespesa() {
    let ano = document.getElementById('ano');
    let mes = document.getElementById('mes');
    let dia = document.getElementById('dia');
    let tipo = document.getElementById('tipo');
    let descricao = document.getElementById('descricao');
    let valor = document.getElementById('valor');

    let despesa = new Despesa(
        ano.value, 
        mes.value, 
        dia.value, 
        tipo.value, 
        descricao.value, 
        valor.value
        )

        if (despesa.validaDados()) {
            bd.gravar(despesa);
            $('#sucessoGravacao').modal('show');
        }else {
            $('#erroGravacao').modal('show');
        }
        

}

function carregaDespesas(despesas = [], filtro = false) {
    
    if (despesas.length == 0 && filtro == false){
        despesas = bd.listarDespesas();
    }
    
    let listaDespesas = document.getElementById('listaDespesas');
    listaDespesas.innerHTML = '';

    despesas.forEach(d => {
        let linhaDespesa = listaDespesas.insertRow();

        switch (d.tipo)  {
            case "1": d.tipo = "Alimentação";
                break;
            case "2": d.tipo = "Educação";
                break;
            case "3": d.tipo = "Lazer";
                break;
            case "4": d.tipo = "Saúde";
                break;
            case "5": d.tipo = "Transporte";
                break;
        }

        
        linhaDespesa.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`;
        linhaDespesa.insertCell(1).innerHTML = d.tipo;
        linhaDespesa.insertCell(2).innerHTML = d.descricao;
        linhaDespesa.insertCell(3).innerHTML = d.valor;

        let btn = document.createElement('button');
        btn.className = "btn btn-danger";
        btn.innerHTML = "<i class='fas fa-times'></i>";
        btn.id = `id_botao_${d.id}`;
        btn.onclick = () => {
            bd.remover(d.id);
            carregaDespesas();
        } 

        linhaDespesa.insertCell(4).append(btn);

    })
}

function consultaDespesa() {

    let dia = document.getElementById('dia').value;
    let mes = document.getElementById('mes').value;
    let ano = document.getElementById('ano').value;
    let tipo = document.getElementById('tipo').value;
    let descricao = document.getElementById('descricao').value;
    let valor = document.getElementById('valor').value;

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor);

    let despesas = bd.pesquisar(despesa);

    carregaDespesas(despesas, true);
}