import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  formChamado: FormGroup;
  tecnicos: Tecnico[];
  nomeTecnico: String;
  nomeCliente: String;
  clientes: Cliente[];
  chamado: Chamado = {
    prioridade: '',
    status: '',
    titulo: '',
    observacoes: '',
    tecnico: '',
    cliente: '',
    nomeCliente: '',
    nomeTecnico: '',
  };

  constructor(
    private fb: FormBuilder,
    private chamadoService: ChamadoService,
    private serviceTecnico: TecnicoService,
    private serviceCliente: ClienteService,
    private toast: ToastrService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.chamado.id = this.route.snapshot.paramMap.get('id');
    this.createForm();
    this.findById();
    this.findAllClientes();
    this.findAllTecnicos();
  }

  findById() {
    this.chamadoService.findById(this.chamado.id).subscribe({
      next: (data) => {
        this.formChamado.controls['titulo'].setValue(data.titulo);
        this.formChamado.controls['status'].setValue(data.status);
        this.formChamado.controls['prioridade'].setValue(data.prioridade);
        this.nomeTecnico = data.nomeTecnico;
        this.nomeCliente = data.nomeCliente;
        this.formChamado.controls['observacoes'].setValue(data.observacoes);
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  createForm() {
    this.formChamado = this.fb.group({
      titulo: this.fb.control('', Validators.required),
      status: this.fb.control('', Validators.required),
      prioridade: this.fb.control('', Validators.required),
      tecnico: this.fb.control('', Validators.required),
      cliente: this.fb.control('', Validators.required),
      observacoes: this.fb.control('', Validators.required)
    })
  }

  findAllClientes(): void {
    this.serviceCliente.findAll().subscribe(resposta => {
      this.clientes = resposta;
    })
  }

  findAllTecnicos(): void {
    this.serviceTecnico.findAll().subscribe(resposta => {
      this.tecnicos = resposta;
    })
  }

  update(): void {
    this.chamado.prioridade = this.formChamado.get('prioridade').value;
    this.chamado.status = this.formChamado.get('status').value;
    this.chamado.titulo = this.formChamado.get('titulo').value;
    this.chamado.observacoes = this.formChamado.get('observacoes').value;
    this.chamado.tecnico = this.formChamado.get('tecnico').value;
    this.chamado.cliente = this.formChamado.get('cliente').value;

    this.chamadoService.update(this.chamado).subscribe({
      next: (resposta) => {
        this.toast.success('Chamado atualizado com sucesso', 'Atualizar chamado');
        this.router.navigate(['chamados']);
      }, error: (ex) => {
        this.toast.error(ex.error.error);
      }
    })
  }

  validaCampos(): boolean {
    return this.formChamado.get('prioridade').valid && this.formChamado.get('status').valid &&
      this.formChamado.get('titulo').valid && this.formChamado.get('tecnico').valid &&
      this.formChamado.get('cliente').valid;
  }

  retornaStatus(status: any): string {
    if (status == '0') {
      return 'ABERTO'
    } else if (status == '1') {
      return 'EM ANDAMENTO'
    } else {
      return 'ENCERRADO'
    }
  }

  retornaPrioridade(prioridade: any): string {
    if (prioridade == '0') {
      return 'BAIXA'
    } else if (prioridade == '1') {
      return 'MÉDIA'
    } else {
      return 'ALTA'
    }
  }
}
