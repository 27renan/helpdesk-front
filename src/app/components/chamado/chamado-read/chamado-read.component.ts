import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Chamado } from 'src/app/models/chamado';
import { ChamadoService } from 'src/app/services/chamado.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { TecnicoService } from 'src/app/services/tecnico.service';

@Component({
  selector: 'app-chamado-read',
  templateUrl: './chamado-read.component.html',
  styleUrls: ['./chamado-read.component.css']
})
export class ChamadoReadComponent implements OnInit {
  formChamado: FormGroup;
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
  }

  findById() {
    this.chamadoService.findById(this.chamado.id).subscribe({
      next: (data) => {
        this.formChamado.controls['titulo'].setValue(data.titulo);
        this.formChamado.controls['status'].setValue(data.status);
        this.formChamado.controls['prioridade'].setValue(data.prioridade);
        this.formChamado.controls['tecnico'].setValue(data.nomeTecnico);
        this.formChamado.controls['cliente'].setValue(data.nomeCliente);
        this.formChamado.controls['observacoes'].setValue(data.observacoes);

        this.formChamado.controls['titulo'].disable({ emitEvent: false });
        this.formChamado.controls['status'].disable({ emitEvent: false });
        this.formChamado.controls['prioridade'].disable({ emitEvent: false });
        this.formChamado.controls['tecnico'].disable({ emitEvent: false });
        this.formChamado.controls['cliente'].disable({ emitEvent: false });
        this.formChamado.controls['observacoes'].disable({ emitEvent: false });
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  createForm() {
    this.formChamado = this.fb.group({
      titulo: this.fb.control(''),
      status: this.fb.control(''),
      prioridade: this.fb.control(''),
      tecnico: this.fb.control(''),
      cliente: this.fb.control(''),
      observacoes: this.fb.control('')
    })
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
