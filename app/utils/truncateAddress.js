import React from 'react'

export const truncateAddress = (address, maxLength) => {
if(address.length > maxLength) {
    return address.substring(0, maxLength) + '...'
}
return address
}

