
import React from 'react';
import Container from './Container';


const AboutSection: React.FC<{ id?: string }> = ({ id }) => {
    return (
      <section id={id} className="py-12">
        <Container>
        <img src="/logo.svg" alt="logo" className="h-24 w-24 mx-auto justify-center" />
        <h2 className="text-3xl font-bold font-kameron text-primary/80 text-center mb-8">About</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-5xl">
        <p className="text-l text-gray-600 text-justify">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vestibulum fermentum mauris ut mattis. Integer vestibulum cursus interdum. Aenean iaculis est eu consequat ultrices. Praesent eleifend posuere sollicitudin. Phasellus a nunc eget lectus iaculis cursus in dapibus nisi. Etiam id purus dolor. Integer viverra lectus eget nisi viverra, non accumsan ligula efficitur. Donec efficitur enim pharetra mi dapibus, vitae convallis risus tempus. Ut viverra dui vel ante dictum, ultrices maximus mi laoreet. Sed fringilla dictum feugiat.
        </p>        <p className="text-l text-gray-600 text-justify">In hac habitasse platea dictumst. Aliquam in metus tortor. In dapibus ultrices scelerisque. Proin laoreet odio et turpis mattis pulvinar. Etiam non risus maximus, laoreet dui non, pellentesque orci. Fusce quis nibh nec elit congue dignissim ac ut elit. Donec placerat, metus sed dapibus viverra, nibh massa semper justo, in commodo purus ante sed lacus. Maecenas at cursus ante, ac consequat urna. Praesent sed pellentesque neque, a ornare magna. Vestibulum posuere dolor eget arcu euismod tristique. Nunc tempus lorem et tortor pretium placerat.
        </p>        <p className="text-l text-gray-600 text-justify">Nulla posuere eget lorem eu dapibus. Vestibulum nulla risus, blandit non pellentesque eget, ultricies a sem. Donec mattis ante lectus. In et iaculis leo, sit amet aliquet sapien. Vivamus sed elit non dolor consectetur suscipit. Phasellus mi arcu, venenatis a dolor vel, tincidunt luctus ex. In bibendum condimentum ipsum et sodales. Ut dapibus mi eros, vel porta sapien finibus non.
        </p>        <p className="text-l text-gray-600 text-justify">Maecenas placerat tellus eget pulvinar feugiat. Praesent molestie magna a velit commodo, vitae eleifend massa consectetur. Quisque in ornare arcu. Vivamus dapibus magna nulla, nec maximus dolor semper iaculis. Nullam ut consectetur lorem, non semper ipsum. Proin et pharetra odio, id interdum eros. Donec eros augue, aliquam at magna in, cursus condimentum orci. Donec ultricies dui eleifend, maximus elit a, bibendum sem. Proin non nunc ut nunc euismod pellentesque. Nullam ut dignissim ante.
        </p>
</div>
    </Container>
         </section>
 );
};

export default AboutSection;