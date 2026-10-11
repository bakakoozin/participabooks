Fonctionnalité: Vérification d'une adresse e-mail

  Scénario: Une inscription est confirmée sans afficher Zitadel
    Étant donné qu'un utilisateur reçoit un e-mail de vérification Participabooks
    Quand il ouvre le lien de vérification
    Alors l'API vérifie le code auprès de Zitadel
    Et le navigateur affiche la confirmation sur Participabooks
    Et le lien final ne contient pas le code de vérification

  Scénario: Un lien de vérification invalide reste sans détail technique
    Étant donné qu'un lien de vérification est expiré ou invalide
    Quand l'utilisateur ouvre ce lien
    Alors le navigateur affiche un message indiquant que le lien ne peut pas être utilisé
