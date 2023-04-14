import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Tecnico } from 'src/app/models/tecnico';
import { TecnicoService } from 'src/app/services/tecnico.service';

@Component({
  selector: 'app-tecnico-delete',
  templateUrl: './tecnico-delete.component.html',
  styleUrls: ['./tecnico-delete.component.css']
})
export class TecnicoDeleteComponent {
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
        this.tecnico.perfis = response.perfis;
        this.tecnico.perfis.includes('ADMIN') ? this.perfilAdm = true : this.perfilAdm = false;
        this.tecnico.perfis.includes('CLIENTE') ? this.perfilCliente = true : this.perfilCliente = false;
        this.tecnico.perfis.includes('TECNICO') ? this.perfilTecnico = true : this.perfilTecnico = false;

        this.formTecnico.controls['nome'].setValue(response.nome);
        this.formTecnico.controls['cpf'].setValue(response.cpf);
        this.formTecnico.controls['email'].setValue(response.email);
        this.formTecnico.controls['senha'].setValue(response.senha);

        this.formTecnico.controls['nome'].disable({ emitEvent: false });
        this.formTecnico.controls['cpf'].disable({ emitEvent: false });
        this.formTecnico.controls['email'].disable({ emitEvent: false });
        this.formTecnico.controls['senha'].disable({ emitEvent: false });
      }
    })
  }

  createForm() {
    this.formTecnico = this.fb.group({
      nome: this.fb.control(''),
      cpf: this.fb.control(''),
      email: this.fb.control(''),
      senha: this.fb.control(''),
    })
  }

  delete() {
    this.tecnico.nome = this.formTecnico.get('nome').value;
    this.tecnico.cpf = this.formTecnico.get('cpf').value;
    this.tecnico.email = this.formTecnico.get('email').value;
    this.tecnico.senha = this.formTecnico.get('senha').value;

    this.service.delete(this.tecnico.id).subscribe({
      next: (data) => {
        this.toast.success('Técnico deletado com sucesso!', 'Delete');
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
}


