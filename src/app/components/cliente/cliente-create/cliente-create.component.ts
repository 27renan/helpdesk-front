import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Cliente } from 'src/app/models/cliente';
import { ClienteService } from '../../../services/cliente.service';

@Component({
  selector: 'app-cliente-create',
  templateUrl: './cliente-create.component.html',
  styleUrls: ['./cliente-create.component.css']
})
export class ClienteCreateComponent {
  formCliente: FormGroup;
  cliente: Cliente = {
    id: '',
    nome: '',
    cpf: '',
    email: '',
    senha: '',
    perfis: [],
    dataCriacao: ''
  }

  constructor(
    private fb: FormBuilder,
    private service: ClienteService,
    private toast: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.formCliente = this.fb.group({
      nome: this.fb.control('', Validators.minLength(3)),
      cpf: this.fb.control('', Validators.required),
      email: this.fb.control('', Validators.email),
      senha: this.fb.control('', Validators.minLength(3)),
      perfis: this.fb.control([], Validators.required)
    })
  }

  addPerfil(perfil: any) {
    if (this.cliente.perfis.includes(perfil)) {
      this.cliente.perfis.splice(this.cliente.perfis.indexOf(perfil), 1);
    } else {
      this.cliente.perfis.push(perfil);
    }
  }

  cadastar() {
    this.cliente.nome = this.formCliente.get('nome').value;
    this.cliente.cpf = this.formCliente.get('cpf').value;
    this.cliente.email = this.formCliente.get('email').value;
    this.cliente.senha = this.formCliente.get('senha').value;

    this.service.create(this.cliente).subscribe({
      next: (data) => {
        this.toast.success('Cliente cadastrado com sucesso!', 'Cadastro');
        this.router.navigate(['clientes']);
      },
      error: (ex) => {
        if (ex.error.erros) {
          ex.error.errors.forEach(element => {
            this.toast.error(element.message);
          });
        } else {
          this.toast.error(ex.error.message);
        }
      }
    })
  }

  validaCampos(): boolean {
    return this.formCliente.get('nome').valid && this.formCliente.get('cpf').valid &&
      this.formCliente.get('senha').valid && this.cliente.perfis.length > 0;
  }
}

