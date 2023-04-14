import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Cliente } from 'src/app/models/cliente';
import { Tecnico } from 'src/app/models/tecnico';
import { ChamadoService } from 'src/app/services/chamado.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { Chamado } from '../../../models/chamado';
import { TecnicoService } from '../../../services/tecnico.service';

@Component({
  selector: 'app-chamado-create',
  templateUrl: './chamado-create.component.html',
  styleUrls: ['./chamado-create.component.css']
})
export class ChamadoCreateComponent implements OnInit {
  formChamado: FormGroup;
  tecnicos: Tecnico[];
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
    private router: Router
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.findAllClientes();
    this.findAllTecnicos();
  }

  findAllClientes() {
    this.serviceCliente.findAll().subscribe({
      next: (data) => {
        this.clientes = data;
      },
      error: (error) => {
        this.toast.error('Erro ao carregar os clientes');
      }
    });
  }

  findAllTecnicos() {
    this.serviceTecnico.findAll().subscribe({
      next: (data) => {
        this.tecnicos = data;
      },
      error: (error) => {
        this.toast.error('Erro ao carregar os tecnicos');
      }
    });
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

  create() {
    this.chamado.prioridade = this.formChamado.get('prioridade').value;
    this.chamado.status = this.formChamado.get('status').value;
    this.chamado.titulo = this.formChamado.get('titulo').value;
    this.chamado.observacoes = this.formChamado.get('observacoes').value;
    this.chamado.tecnico = this.formChamado.get('tecnico').value;
    this.chamado.cliente = this.formChamado.get('cliente').value;

    this.chamadoService.create(this.chamado).subscribe({
      next: (data) => {
        this.toast.success('Chamado criado com sucesso', 'Novo chamado');
        this.router.navigate(['chamados']);
      },
      error: (ex) => {
        this.toast.error(ex.error.error);
      }
    })
  }

  validaCampos(): boolean {
    return this.formChamado.get('prioridade').valid && this.formChamado.get('status').valid &&
      this.formChamado.get('titulo').valid && this.formChamado.get('tecnico').valid &&
      this.formChamado.get('cliente').valid;
  }
}
