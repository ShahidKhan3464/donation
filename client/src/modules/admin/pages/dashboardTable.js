import React, { useState } from 'react';
import { PrimaryHeading, TableContainer } from '../../../globalStyle';
import sweetAlert from "../../../components/sweetAlert";
import { MdDone, MdCancel } from 'react-icons/md';
import Modal from '../../../components/modal';
import Table from 'react-bootstrap/Table';
import { List } from './style';
import axios from 'axios';

const Index = ({ recentDonations, loadData }) => {
    const [open, setOpen] = useState(false)
    const token = localStorage.getItem('token')
    const [medicine, setMedicine] = useState({})
    const [viewImages, setViewImages] = useState([])

    const handleModal = (donatedMedicine, images) => {
        setMedicine(donatedMedicine)
        setViewImages(images)
        setOpen(true)
    }

    const handleApprove = async (id) => {
        try {
            // setLoading(true)
            const { data, status } = await axios.put(`http://localhost:3001/api/donation/approve/${id}`, {
                headers: { token }
            })

            if (status === 200) {
                sweetAlert('success', 'Success', `${data.message}`);
                // setLoading(false)
                loadData()
            }
        }
        catch (err) {
            // setLoading(true)
            sweetAlert('error', 'Error!', `${err.response && err.response.data ? err.response.data.message : err.message}`);
            // setLoading(false)
        }
    }

    return (
        <List>
            {open && <Modal open={open} setOpen={setOpen} medicine={medicine} images={viewImages} />}
            <PrimaryHeading size="25px">Recent Donations</PrimaryHeading>
            <TableContainer>
                <Table responsive>
                    <thead>
                        <tr>
                            <th>Donor</th>
                            <th>Email</th>
                            <th>Address</th>
                            <th>Date</th>
                            <th>Medicine</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentDonations.length === 0
                            ? <tr>
                                <td
                                    colSpan='7'
                                    style={{ textAlign: 'center', color: 'red', fontWeight: 'bold', paddingTop: '20px' }}
                                >
                                    No Donations Made Yet !!!
                                </td>
                            </tr>
                            : recentDonations.map(({ _id, donor, donatedMedicine, images, date }) => (
                                <tr key={_id}>
                                    <td>{donor.fullName}</td>
                                    <td>{donor.email}</td>
                                    <td>{donor.address}</td>
                                    <td>{new Date(date).toLocaleDateString('en-GB')}</td>
                                    <td>
                                        <button onClick={() => handleModal(donatedMedicine, images)}>Details</button>
                                    </td>
                                    <td>
                                        <MdDone style={{ background: 'green' }} onClick={() => handleApprove(_id)} />
                                        <MdCancel style={{ color: 'red' }} />
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </Table>
            </TableContainer>
        </List >
    )
}

export default Index