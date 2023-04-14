import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Cliente } from 'src/app/models/cliente';
import { ClienteService } from '../../../services/cliente.service';

@Component({
  selector: 'app-cliente-update',
  templateUrl: './cliente-update.component.html',
  styleUrls: ['./cliente-update.component.css']
})
export class ClienteUpdateComponent {
  formCliente: FormGroup;
  perfilAdm: boolean = false;
  perfilCliente: boolean = false;
  perfilTecnico: boolean = false;
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
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.cliente.id = this.route.snapshot.paramMap.get('id');
    this.createForm();
    this.findById();
  }

  findById(): void {
    this.service.findById(this.cliente.id).subscribe({
      next: (response) => {
        response.perfis.forEach(perfil => {
          if (perfil === 'ADMIN') {
            this.perfilAdm = true;
            this.cliente.perfis.push(0);
          } else if (perfil === 'CLIENTE') {
            this.perfilCliente = true;
            this.cliente.perfis.push(1);
          } else {
            this.perfilTecnico = true;
            this.cliente.perfis.push(2);
          }
        })

        this.formCliente.controls['nome'].setValue(response.nome);
        this.formCliente.controls['cpf'].setValue(response.cpf);
        this.formCliente.controls['email'].setValue(response.email);
        this.formCliente.controls['senha'].setValue(response.senha);
      }
    })
  }

  createForm() {
    this.formCliente = this.fb.group({
      nome: this.fb.control('', Validators.minLength(3)),
      cpf: this.fb.control('', Validators.required),
      email: this.fb.control('', Validators.email),
      senha: this.fb.control('', Validators.minLength(3)),
    })
  }

  addPerfil(perfil: any): void {
    if (this.cliente.perfis.includes(perfil)) {
      this.cliente.perfis.splice(this.cliente.perfis.indexOf(perfil), 1);
    } else {
      this.cliente.perfis.push(perfil);
    }
  }

  update() {
    this.cliente.nome = this.formCliente.get('nome').value;
    this.cliente.cpf = this.formCliente.get('cpf').value;
    this.cliente.email = this.formCliente.get('email').value;
    this.cliente.senha = this.formCliente.get('senha').value;

    this.service.update(this.cliente).subscribe({
      next: (data) => {
        this.toast.success('Cliente atualizado com sucesso!', 'Update');
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


