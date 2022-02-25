import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Chamado } from 'src/app/models/chamado';
import { Cliente } from 'src/app/models/cliente';
import { Tecnico } from 'src/app/models/tecnico';
import { ChamadoService } from 'src/app/services/chamado.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { TecnicoService } from 'src/app/services/tecnico.service';

@Component({
  selector: 'app-chamado-create',
  templateUrl: './chamado-create.component.html',
  styleUrls: ['./chamado-create.component.css']
})
export class ChamadoCreateComponent implements OnInit {

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
  observacao: FormControl = new FormControl(null, [Validators.required])
  tecnico:     FormControl = new FormControl(null, [Validators.required])
  cliente:     FormControl = new FormControl(null, [Validators.required])
  
  constructor(
    private chamadoService: ChamadoService,
    private tecnicoService: TecnicoService,
    private clienteService: ClienteService,
    private toastservice:   ToastrService,
    private router: Router
  ) { }

 

  ngOnInit(): void {
    this.findAllClientes()
    this.findAllTecnicos()
  }

  findAllClientes(): void{
    this.clienteService.findAll().subscribe(resposta => {
      this.clientes = resposta
    })
  }  

  findAllTecnicos(): void{
    this.tecnicoService.findAll().subscribe(resposta => {
      this.tecnicos = resposta;
    })
  }

  create(): void{
    this.chamadoService.create(this.chamado).subscribe(resposta => {
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

  /*applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }*/

}
