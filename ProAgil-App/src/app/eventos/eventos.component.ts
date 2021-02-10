import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Evento } from 'src/models/Evento';
import { EventoService } from '../services/evento.service';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.scss']
})

export class EventosComponent implements OnInit {

  data: Evento[] = [];
  dataFilter: Evento[] = []
  mostrarImagem: boolean = false;
  modalRef!: BsModalRef;

  constructor(
    private eventoService: EventoService,
    private modalService: BsModalService
    ) { }

  ngOnInit() {
    this.getEventos()
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
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