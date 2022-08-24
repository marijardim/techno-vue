const vm = new Vue({
  el: "#app",
  data:{
    produtos: [],
    produto: '',
    carrinho: [],
    mensagemAlerta: "Item adicionado ao carrinho",
    alertaAtivo: false,
    carrinhoAtivo: false,
  },
  filters:{
    numeroPreco(valor){
    return valor.toLocaleString("pt-BR", {style: 'currency', currency: "BRL"})
    }
  },
  computed:{
    carrinhoTotal(){
      let total = 0;
      if(this.carrinho.length){
        this.carrinho.forEach(item =>{
          total += item.preco
        } )
      }
      return total
    }
  },
  methods:{
    fetchProdutos(){
      fetch('./api/produtos.json')
      .then(r => r.json())
      .then(rjson => this.produtos = rjson)
    },
    fetchProduto(id){
      fetch(`./api/produtos/${id}/dados.json`)
      .then(r => r.json())
      .then(rjson => this.produto = rjson)
    },
    abrirModal(id){
      this.fetchProduto(id);
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      })
    },
    fecharModal({target, currentTarget}){
     if(target === currentTarget){
       this.produto = false
     }
    },
    clickForaCarrinho({target, currentTarget}){
      if(target === currentTarget){
        this.carrinhoAtivo = false
      }
     },
    adicionarItem(){
      this.produto.estoque--;
      const {nome, id, preco} = this.produto
      this.carrinho.push({nome, id, preco});
      this.alerta(`${nome} foi adicionado ao carrinho`)
    },
    compararEstoque(){
     const items = this.carrinho.filter(item => item.id === this.produto.id)
      this.produto.estoque = this.produto.estoque - items.length
    },
    alerta(mensagem){
      this.mensagemAlerta = mensagem;
      this.alertaAtivo = true;
      setTimeout(() => {
        this.alertaAtivo = false
      }, 1500)
    },
    removerItem(index){
      this.carrinho.splice(index, 1)
    },
    checarLocalStorage(){
      if(window.localStorage.carrinho){
        this.carrinho = JSON.parse(window.localStorage.carrinho)
      }
    },
    router(){
      const hash = document.location.hash;
      if(hash)
      this.fetchProduto(hash.replace('#', ''))
    }
  },
  watch:{
    produto(){
      document.title = this.produto.nome || "Techno"
      const hash = this.produto.id || ''
      history.pushState(null, null, `/#${hash}`);
      if(this.produto){
        this.compararEstoque()

      }
    },
    carrinho(){
      window.localStorage.carrinho = JSON.stringify(this.carrinho)
    }
  },
  created(){
   this.fetchProdutos();
   this.checarLocalStorage();
   this.router();
  }
})