import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Cliente } from 'src/app/models/cliente';
import { ClienteService } from '../../../services/cliente.service';

@Component({
  selector: 'app-cliente-delete',
  templateUrl: './cliente-delete.component.html',
  styleUrls: ['./cliente-delete.component.css']
})
export class ClienteDeleteComponent {
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
        this.cliente.perfis = response.perfis;
        this.cliente.perfis.includes('ADMIN') ? this.perfilAdm = true : this.perfilAdm = false;
        this.cliente.perfis.includes('CLIENTE') ? this.perfilCliente = true : this.perfilCliente = false;
        this.cliente.perfis.includes('TECNICO') ? this.perfilTecnico = true : this.perfilTecnico = false;

        this.formCliente.controls['nome'].setValue(response.nome);
        this.formCliente.controls['cpf'].setValue(response.cpf);
        this.formCliente.controls['email'].setValue(response.email);
        this.formCliente.controls['senha'].setValue(response.senha);

        this.formCliente.controls['nome'].disable({ emitEvent: false });
        this.formCliente.controls['cpf'].disable({ emitEvent: false });
        this.formCliente.controls['email'].disable({ emitEvent: false });
        this.formCliente.controls['senha'].disable({ emitEvent: false });
      }
    })
  }

  createForm() {
    this.formCliente = this.fb.group({
      nome: this.fb.control(''),
      cpf: this.fb.control(''),
      email: this.fb.control(''),
      senha: this.fb.control(''),
    })
  }

  delete() {
    this.cliente.nome = this.formCliente.get('nome').value;
    this.cliente.cpf = this.formCliente.get('cpf').value;
    this.cliente.email = this.formCliente.get('email').value;
    this.cliente.senha = this.formCliente.get('senha').value;

    this.service.delete(this.cliente.id).subscribe({
      next: (data) => {
        this.toast.success('Cliente deletado com sucesso!', 'Delete');
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
}


