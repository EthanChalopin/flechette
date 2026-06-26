# Flechettes

Application de score pour jouer aux flechettes.

Ce guide explique comment installer l'application sur un ordinateur, la lancer, puis y acceder depuis un telephone connecte au meme Wi-Fi.

Le compte GitHub n'est pas obligatoire si le depot est public. Il suffit d'avoir Git et Node.js installes.

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

Sur Mac, si le terminal demande d'installer les "Command Line Tools", accepter l'installation.

## 2. Telecharger l'application depuis GitHub

### Sur Windows

Ouvrir PowerShell.

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

### Sur Mac

Ouvrir l'application Terminal.

Aller dans le dossier ou vous voulez installer l'application, par exemple le bureau :

```bash
cd ~/Desktop
```

Telecharger le projet :

```bash
git clone https://github.com/EthanChalopin/flechette.git
```

Entrer dans le dossier du projet :

```bash
cd flechette
```

## 3. Installer l'application

Lancer cette commande :

```bash
npm install
```

Cette etape peut prendre quelques minutes.

## 4. Preparer l'application pour l'utilisation

Lancer :

```bash
npm run build
```

Attendre que la commande se termine sans erreur.

## 5. Lancer l'application sur l'ordinateur

Lancer :

```bash
npm run start -- -H 0.0.0.0 -p 3000
```

Il faut laisser ce terminal ouvert pendant l'utilisation de l'application.

Sur Windows, si une alerte pare-feu apparait, cliquer sur **Autoriser** et cocher au minimum :

```text
Reseaux prives
```

Sur Mac, si une alerte de securite ou de pare-feu apparait, autoriser Node.js ou Terminal a accepter les connexions reseau.

## 6. Trouver l'adresse IP de l'ordinateur

### Sur Windows

Ouvrir un deuxieme terminal PowerShell et taper :

```powershell
ipconfig
```

Chercher la ligne :

```text
Adresse IPv4
```

Dans la partie Wi-Fi.

### Sur Mac

Ouvrir un deuxieme Terminal et taper :

```bash
ipconfig getifaddr en0
```

Si la commande ne retourne rien, essayer :

```bash
ipconfig getifaddr en1
```

L'adresse IP ressemble souvent a :

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

### Sur Windows

Ouvrir PowerShell.

Aller dans le dossier du projet :

```powershell
cd Desktop\flechette
```

Lancer l'application :

```powershell
npm run start -- -H 0.0.0.0 -p 3000
```

### Sur Mac

Ouvrir Terminal.

Aller dans le dossier du projet :

```bash
cd ~/Desktop/flechette
```

Lancer l'application :

```bash
npm run start -- -H 0.0.0.0 -p 3000
```

Puis ouvrir sur le telephone :

```text
http://ADRESSE-IP:3000
```

## 9. Mettre a jour l'application

Si une nouvelle version est publiee sur GitHub :

### Sur Windows

```powershell
cd Desktop\flechette
git pull
npm install
npm run build
npm run start -- -H 0.0.0.0 -p 3000
```

### Sur Mac

```bash
cd ~/Desktop/flechette
git pull
npm install
npm run build
npm run start -- -H 0.0.0.0 -p 3000
```

## Resume rapide Windows

Sur l'ordinateur :

```powershell
git clone https://github.com/EthanChalopin/flechette.git
cd flechette
npm install
npm run build
npm run start -- -H 0.0.0.0 -p 3000
```

Pour trouver l'IP :

```powershell
ipconfig
```

Sur le telephone :

```text
http://IP-DE-LORDINATEUR:3000
```

## Resume rapide Mac

Sur l'ordinateur :

```bash
git clone https://github.com/EthanChalopin/flechette.git
cd flechette
npm install
npm run build
npm run start -- -H 0.0.0.0 -p 3000
```

Pour trouver l'IP :

```bash
ipconfig getifaddr en0
```

Sur le telephone :

```text
http://IP-DU-MAC:3000
```
