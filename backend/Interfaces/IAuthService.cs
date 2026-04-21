//import les models pour utils AuthResponse..
using LeadProdos.Backend.Models;
//import les DTOS :LoginRequest,..
using LeadProdos.Backend.DTOs;
//importe Task pour les methd asynchrones .Task:operat qui s'execute en arriere plan
using System.Threading.Tasks;

namespace LeadProdos.Backend.Interfaces
{
    public interface IAuthService
    {
        //connecter un utils.rec login Req retourne AuthResponse
        /*React envoie LoginRequest
                    ↓
        LoginAsync vérifie email + password
                    ↓
        Retourne AuthResponse avec Token
                    ↓
        React stocke le Token*/

        //vrf si un token JWT valide .rec un string token retourne bool
        /*React envoie une requête avec le Token
                ↓
        ValidateTokenAsync vérifie :
        ├── Token existe ?
        ├── Token expiré ?
        └── Token falsifié ?
            ↓
        true  → requête acceptée
        false → erreur 401 Non autorisé*/
        Task<AuthResponse> LoginAsync(LoginRequest request);
        Task<bool> ValidateTokenAsync(string token);

        //chnage le md pss depuis profil rec ChangePasswordRequest, retourne bool
        /*Vérifie oldPassword → correct ?
            ↓ oui
        Chiffre newPassword avec BCrypt
            ↓
        Sauvegarde nouveau PasswordHash
            ↓
        Retourne true ✅*/
        Task<bool> ChangePasswordAsync(ChangePasswordRequest request);

        //reset le md pss par l'admin,rec ResetPasswordRequest ete retourne bool
        /*Admin envoie userId + newPassword
            ↓
        Trouve le User par userId
            ↓
        Chiffre newPassword
            ↓
        Sauvegarde → retourne true ✅*/
        Task<bool> ResetPasswordAsync(ResetPasswordRequest request);

        //declenche l'env de mail de reinit, rec ForgotPasswordRequeest,et retiourne bool
        /*Reçoit email + resetBaseUrl
            ↓
        Trouve le User par email
            ↓
        Génère un Token secret aléatoire
            ↓
        Crée PasswordResetToken dans MongoDB
            ↓
        Envoie email avec lien :
        "https://leadprodos.ia/reset?token=abc123"
            ↓
        Retourne true ✅*/
        Task<bool> ForgotPasswordAsync(ForgotPasswordRequest request, string resetBaseUrl);

        //finalise le reinit qd l'utils cliq le lien,rec ResetPasswordWithTokenRequest et retourne bool
        /*Reçoit token + newPassword
            ↓
        Trouve PasswordResetToken dans MongoDB
            ↓
        Vérifie :
        ├── Token existe ?          ✅
        ├── ExpiresAt > maintenant? ✅
        └── IsUsed == false ?       ✅
            ↓
        Chiffre newPassword → sauvegarde
            ↓
        Met IsUsed = true → token désactivé
            ↓
        Retourne true ✅*/
        Task<bool> ResetPasswordWithTokenAsync(ResetPasswordWithTokenRequest request);
    }
}

/*IAuthService.cs
│
├── LoginAsync              → connexion          → AuthResponse
├── ValidateTokenAsync      → vérif token        → bool
│
├── ChangePasswordAsync     → changer mdp (user) → bool
├── ResetPasswordAsync      → reset mdp (admin)  → bool
│
├── ForgotPasswordAsync     → envoyer email      → bool
└── ResetPasswordWithTokenAsync → nouveau mdp    → bool*/
