import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Chamado } from 'src/app/models/chamado';
import { Cliente } from 'src/app/models/cliente';
import { Tecnico } from 'src/app/models/tecnico';
import { ChamadoService } from 'src/app/services/chamado.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { TecnicoService } from 'src/app/services/tecnico.service';

@Component({
  selector: 'app-chamado-update',
  templateUrl: './chamado-update.component.html',
  styleUrls: ['./chamado-update.component.css']
})
export class ChamadoUpdateComponent implements OnInit {
  chamado: Chamado = {
    prioridade:  '',
    status:      '',
    titulo:      '',
    observacao: '',
    tecnico:     '',
    cliente:     '',
    nomeCliente: '',
    nomeTecnico: '',
  }

  clientes: Cliente[] = []
  tecnicos: Tecnico[] = []

  prioridade:  FormControl = new FormControl(null, [Validators.required])
  status:      FormControl = new FormControl(null, [Validators.required])
  titulo:      FormControl = new FormControl(null, [Validators.required])
  observacao: FormControl  = new FormControl(null, [Validators.required])
  tecnico:     FormControl = new FormControl(null, [Validators.required])
  cliente:     FormControl = new FormControl(null, [Validators.required])
  
  constructor(
    private chamadoService: ChamadoService,
    private tecnicoService: TecnicoService,
    private clienteService: ClienteService,
    private toastservice:    ToastrService,
    private router:                 Router,
    private route:           ActivatedRoute
  ) { }

 

  ngOnInit(): void {
    this.chamado.id = this.route.snapshot.paramMap.get('id')
    this.findById();
    this.findAllClientes()
    this.findAllTecnicos()
  }

  findAllClientes(): void{
    this.clienteService.findAll().subscribe(resposta => {
      this.clientes = resposta
    })
  }  

  findById(): void{
    this.chamadoService.findById(this.chamado.id).subscribe(resposta => {
      this.chamado = resposta;
    }, ex => {
      this.toastservice.error(ex.error.error);
      console.log(ex);
      this.router.navigate(['chamados'])
    })
  }

  findAllTecnicos(): void{
    this.tecnicoService.findAll().subscribe(resposta => {
      this.tecnicos = resposta;
    })
  }

  update(): void{
    this.chamadoService.update(this.chamado).subscribe(resposta => {
      this.toastservice.success('Chamado criado com sucesso!', 'Chamado')
      this.router.navigate(['chamados'])
    }, ex => {
      this.toastservice.error(ex.error.error);
      console.log(ex);      
      this.router.navigate(['chamados'])
    })
  }

  validaCampos(): boolean{
    return this.prioridade.valid && this.status.valid &&
            this.titulo.valid && this.observacao.valid &&
            this.cliente.valid && this.tecnico.valid

  }

  retornaStatus(status: any): string{
    if(status == '0'){
      return 'ABERTO'
    }else if(status == '1'){
      return 'EM ANDAMENTO'
    }else{
      return 'ENCERRADO'
    }
  }

  retornaPrioridade(prioridade: any): string{
    if(prioridade == '0'){
      return 'BAIXA'
    }else if(prioridade == '1'){
      return 'MÉDIA'
    }else{
      return 'ALTA'
    }
  }

  /*applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }*/

}
