import Layout from '@theme/Layout'

const services = [
    {name: 'Sync API', ok: true}
];

export default function Status() {
    return (
        <Layout title="Status" description="Current status of Nimbus services">
            <main className="container margin-vert--lg">
                <h1>Service Status</h1>
                <ul>
                    {services.map((service) => (
                        <li key={service.name}>
                            {service.ok ? '🟢' : '🔴'} {service.name}
                        </li>
                    ))}
                </ul>
            </main>
        </Layout>
    );
}