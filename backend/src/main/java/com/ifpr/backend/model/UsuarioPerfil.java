package com.ifpr.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Entity
@Data
public class UsuarioPerfil {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_perfil")
    @NotBlank(message = "Perfil cannot be blank")
    private Perfil perfil;

    @ManyToOne
    @JoinColumn(name = "id_usuario")
    @NotBlank(message = "Usuário cannot be blank")
    private User usuario;
}
