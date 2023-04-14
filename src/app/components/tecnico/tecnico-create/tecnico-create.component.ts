import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Tecnico } from 'src/app/models/tecnico';
import { TecnicoService } from 'src/app/services/tecnico.service';

@Component({
  selector: 'app-tecnico-create',
  templateUrl: './tecnico-create.component.html',
  styleUrls: ['./tecnico-create.component.css']
})
export class TecnicoCreateComponent implements OnInit {
  formTecnico: FormGroup;
  tecnico: Tecnico = {
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
    private service: TecnicoService,
    private toast: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.formTecnico = this.fb.group({
      nome: this.fb.control('', Validators.minLength(3)),
      cpf: this.fb.control('', Validators.required),
      email: this.fb.control('', Validators.email),
      senha: this.fb.control('', Validators.minLength(3)),
      perfis: this.fb.control([], Validators.required)
    })
  }

  addPerfil(perfil: any) {
    if (this.tecnico.perfis.includes(perfil)) {
      this.tecnico.perfis.splice(this.tecnico.perfis.indexOf(perfil), 1);
    } else {
      this.tecnico.perfis.push(perfil);
    }
  }

  cadastar() {
    this.tecnico.nome = this.formTecnico.get('nome').value;
    this.tecnico.cpf = this.formTecnico.get('cpf').value;
    this.tecnico.email = this.formTecnico.get('email').value;
    this.tecnico.senha = this.formTecnico.get('senha').value;

    this.service.create(this.tecnico).subscribe({
      next: (data) => {
        this.toast.success('Técnico cadastrado com sucesso!', 'Cadastro');
        this.router.navigate(['tecnicos']);
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
    return this.formTecnico.get('nome').valid && this.formTecnico.get('cpf').valid &&
      this.formTecnico.get('senha').valid && this.tecnico.perfis.length > 0;
  }
}
