import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Evento } from 'src/models/Evento';
import { EventoService } from '../services/evento.service';
import { BsLocaleService} from 'ngx-bootstrap/datepicker';
import { defineLocale, ptBrLocale } from 'ngx-bootstrap/chronos'
import { templateJitUrl } from '@angular/compiler';
defineLocale('pt-br', ptBrLocale);

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.scss']
})

export class EventosComponent implements OnInit {
  
  data: Evento[] = [];
  evento!: Evento;
  dataFilter: Evento[] = []
  mostrarImagem: boolean = false;
  registerForm!: FormGroup;
  modoSalvar = 'post'
  bodyDeletarEvento = '';
  
  constructor(
    private eventoService: EventoService,
    private modalService: BsModalService,
    private fb: FormBuilder,
    private localeService: BsLocaleService
    ) { 
      this.localeService.use('pt-br')
    }
    
    ngOnInit() {
      this.validatiton();
      this.getEventos();
    }
    
    openModal(template: any) {
      this.registerForm.reset();
      template.show();
    }
    
    validatiton() {
      this.registerForm = this.fb.group({
        tema: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
        local: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
        dataEvento: ['', Validators.required],
        qtdPessoas: ['', [Validators.required, Validators.min(10), Validators.max(1200)]],
        telefone: ['', [Validators.required, Validators.minLength(11)]],
        email: ['', [Validators.required, Validators.email]],
        lote: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]]
      })
    }
    
    editarEvento(evento: Evento, template: any){
      this.modoSalvar = 'put'
      this.openModal(template);
      this.evento = evento;
      this.registerForm.patchValue(evento);
    }
    
    novoEvento(template: any){
      this.modoSalvar = 'post'
      this.openModal(template);
    }
    
    salvarAlteracao(template: any) {
      if(this.registerForm.valid){
        if(this.modoSalvar === 'post'){
          this.evento = Object.assign({}, this.registerForm.value);
          this.eventoService.postEvento(this.evento).subscribe(
            (novoEvento) => {
              template.hide();
              this.getEventos();
            }, error => {
              console.log(error)
            }
            )
          } else {
            this.evento = Object.assign({id: this.evento.id}, this.registerForm.value);
          this.eventoService.putEvento(this.evento).subscribe(
            () => {
              template.hide();
              this.getEventos();
            }, error => {
              console.log(error)
            }
            )
          }
        }
      }

      confirmeDelete(template: any) {
        this.eventoService.deleteEvento(this.evento.id).subscribe(
          () => {
              template.hide();
              this.getEventos();
            }, error => {
              console.log(error);
            }
        );
      }

      excluirEvento(evento: Evento, template: any) {
        this.openModal(template);
        this.evento = evento;
        this.bodyDeletarEvento = `Tem certeza que deseja excluir o Evento: ${evento.tema}, Código: ${evento.id}`;
      }
      
      
      alterarImagem() {
        this.mostrarImagem = !this.mostrarImagem;
      }
      
      inputFilterChange(filtragem: any) {
        let value: string = filtragem.target.value
        this.filtrar(value)
      }
      
      filtrar(value: string): any {
        this.dataFilter = this.filtrarTema(value)
      }
      
      filtrarTema(filtrarPor: string): Evento[] {
        filtrarPor = filtrarPor.toLocaleLowerCase();
        return this.data.filter(
          evento => evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1
          )
        }
        
        getEventos() {
          this.eventoService.getAllEvento().subscribe( 
            (_eventos) => {
              this.data = _eventos;
              this.dataFilter = this.data;
            }, error => {
              console.log(error)
            })
          }
        }