# Neurosonic

Neste projeto, quis explorar a relação entre o som e a atividade neuronal, criando uma representação visual abstrata de um sistema em constante movimento e transformação.

Como input, escolhi o som captado pelo microfone, permitindo ao utilizador interagir com o projeto através da voz ou de outros sons do ambiente.
Utilizei Perlin Noise (noise()) para gerar linhas horizontais com deformações orgânicas e fluidas. A intensidade sonora influência a amplitude dessas deformações, fazendo com que as linhas reajam ao som em tempo real. Utilizei também lerp() para suavizar a reação e criar um movimento mais fluido. Escolhi uma estética a preto e branco para destacar o movimento das formas.
Com este projeto, pretendi proporcionar uma experiência visual generativa e interativa que transmitisse uma sensação de fluidez, conexão e transformação, como se as linhas fossem uma representação visual de uma atividade interna invisível.

Para o seu desenvolvimento, utilizei um vídeo de referência (https://youtu.be/UsIF5r8rAvk?si=nPGk6DaqvmXdqrvw) e recorri à IA para adaptar os exemplos de código ao meu objetivo: criar uma relação entre a captação de som e o movimento visual. Ao longo do processo, testei e ajustei alguns parâmetros, nomeadamente a sensibilidade sonora e o comportamento das linhas.