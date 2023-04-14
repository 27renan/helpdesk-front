import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Tecnico } from 'src/app/models/tecnico';
import { TecnicoService } from 'src/app/services/tecnico.service';

@Component({
  selector: 'app-tecnico-update',
  templateUrl: './tecnico-update.component.html',
  styleUrls: ['./tecnico-update.component.css']
})
export class TecnicoUpdateComponent {
  formTecnico: FormGroup;
  perfilAdm: boolean = false;
  perfilCliente: boolean = false;
  perfilTecnico: boolean = false;
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
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.tecnico.id = this.route.snapshot.paramMap.get('id');
    this.createForm();
    this.findById();
  }

  findById(): void {
    this.service.findById(this.tecnico.id).subscribe({
      next: (response) => {
        response.perfis.forEach(perfil => {
          if (perfil === 'ADMIN') {
            this.perfilAdm = true;
            this.tecnico.perfis.push(0);
          } else if (perfil === 'CLIENTE') {
            this.perfilCliente = true;
            this.tecnico.perfis.push(1);
          } else {
            this.perfilTecnico = true;
            this.tecnico.perfis.push(2);
          }
        })

        this.formTecnico.controls['nome'].setValue(response.nome);
        this.formTecnico.controls['cpf'].setValue(response.cpf);
        this.formTecnico.controls['email'].setValue(response.email);
        this.formTecnico.controls['senha'].setValue(response.senha);
      }
    })
  }

  createForm() {
    this.formTecnico = this.fb.group({
      nome: this.fb.control('', Validators.minLength(3)),
      cpf: this.fb.control('', Validators.required),
      email: this.fb.control('', Validators.email),
      senha: this.fb.control('', Validators.minLength(3)),
    })
  }

  addPerfil(perfil: any): void {
    if (this.tecnico.perfis.includes(perfil)) {
      this.tecnico.perfis.splice(this.tecnico.perfis.indexOf(perfil), 1);
    } else {
      this.tecnico.perfis.push(perfil);
    }
  }

  update() {
    this.tecnico.nome = this.formTecnico.get('nome').value;
    this.tecnico.cpf = this.formTecnico.get('cpf').value;
    this.tecnico.email = this.formTecnico.get('email').value;
    this.tecnico.senha = this.formTecnico.get('senha').value;

    this.service.update(this.tecnico).subscribe({
      next: (data) => {
        this.toast.success('Técnico atualizado com sucesso!', 'Update');
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

