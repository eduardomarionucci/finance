package com.ifpr.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ifpr.backend.model.Perfil;
import com.ifpr.backend.repository.PerfilRepository;

@Service
public class PerfilService {
    
    @Autowired
    private PerfilRepository repository; 

    public Perfil insert(Perfil profile) {
        return repository.save(profile);
    }

    public Perfil update(Perfil profile) {
        Perfil foundedProfile = repository.findById(profile.getId())
            .orElseThrow(() -> new RuntimeException("Perfil não encontrado"));
            
        foundedProfile.setDescription(profile.getDescription());

        return repository.save(foundedProfile);
    }

    public void deleteById(Long id) {
        repository.deleteById(id);
    }

    public List<Perfil> findAll() {
        return repository.findAll();
    }

    public Perfil findById(Long id) {
        Perfil profile = repository.findById(id)
        .orElseThrow(() -> new RuntimeException("Perfil não encontrado"));

        return profile;
    }
}
