# Flechettes

Application de score pour jouer aux flechettes.

Ce guide explique comment installer l'application sur un ordinateur, la lancer, puis y acceder depuis un telephone connecte au meme Wi-Fi.

## 1. Installer les outils necessaires

Installer Git :

```text
https://git-scm.com/downloads
```

Installer Node.js version LTS :

```text
https://nodejs.org/
```

Pendant les installations, garder les options par defaut.

## 2. Telecharger l'application depuis GitHub

Ouvrir un terminal.

Sur Windows, ouvrir PowerShell.

Aller dans le dossier ou vous voulez installer l'application, par exemple le bureau :

```powershell
cd Desktop
```

Telecharger le projet :

```powershell
git clone https://github.com/EthanChalopin/flechette.git
```

Entrer dans le dossier du projet :

```powershell
cd flechette
```

## 3. Installer l'application

Lancer cette commande :

```powershell
npm install
```

Cette etape peut prendre quelques minutes.

## 4. Preparer l'application pour l'utilisation

Lancer :

```powershell
npm run build
```

Attendre que la commande se termine sans erreur.

## 5. Lancer l'application sur l'ordinateur

Lancer :

```powershell
npm run start -- -H 0.0.0.0 -p 3000
```

Il faut laisser ce terminal ouvert pendant l'utilisation de l'application.

Si Windows affiche une alerte pare-feu, cliquer sur **Autoriser**.

Cocher au minimum :

```text
Reseaux prives
```

## 6. Trouver l'adresse IP de l'ordinateur

Ouvrir un deuxieme terminal PowerShell et taper :

```powershell
ipconfig
```

Chercher la ligne :

```text
Adresse IPv4
```

Dans la partie Wi-Fi.

L'adresse ressemble souvent a :

```text
192.168.1.4
```

## 7. Ouvrir l'application sur le telephone

Le telephone doit etre connecte au meme Wi-Fi que l'ordinateur.

Dans le navigateur du telephone, ouvrir :

```text
http://ADRESSE-IP:3000
```

Exemple :

```text
http://192.168.1.4:3000
```

## 8. Relancer l'application plus tard

Ouvrir PowerShell.

Aller dans le dossier du projet :

```powershell
cd Desktop\flechette
```

Lancer l'application :

```powershell
npm run start -- -H 0.0.0.0 -p 3000
```

Puis ouvrir sur le telephone :

```text
http://ADRESSE-IP:3000
```

## 9. Mettre a jour l'application

Si une nouvelle version est publiee sur GitHub :

```powershell
cd Desktop\flechette
git pull
npm install
npm run build
npm run start -- -H 0.0.0.0 -p 3000
```

## Resume rapide

Sur l'ordinateur :

```powershell
git clone https://github.com/EthanChalopin/flechette.git
cd flechette
npm install
npm run build
npm run start -- -H 0.0.0.0 -p 3000
```

Sur le telephone :

```text
http://IP-DE-LORDINATEUR:3000
```
